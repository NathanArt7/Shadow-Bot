const { Pool } = require('pg');
const { proto, initAuthCreds, BufferJSON } = require('@whiskeysockets/baileys');

// Postgres-backed equivalent of Baileys' useMultiFileAuthState, for hosts
// (like Render's free tier) whose local filesystem doesn't survive restarts.
// Same key/value shape as the file-based version (one row per "file"), just
// stored in a table instead of on disk.
async function usePostgresAuthState(connectionString) {
    const pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    await pool.query(`
        CREATE TABLE IF NOT EXISTS baileys_auth_state (
            key TEXT PRIMARY KEY,
            value JSONB NOT NULL,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
    `);

    const writeData = async (data, key) => {
        const json = JSON.stringify(data, BufferJSON.replacer);
        await pool.query(
            `INSERT INTO baileys_auth_state (key, value, updated_at)
             VALUES ($1, $2::jsonb, now())
             ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
            [key, json]
        );
    };

    const readData = async (key) => {
        const res = await pool.query('SELECT value FROM baileys_auth_state WHERE key = $1', [key]);
        if (res.rows.length === 0) return null;
        // node-pg already parses jsonb into a JS value, so re-stringify then
        // parse through BufferJSON.reviver to restore Buffers correctly.
        return JSON.parse(JSON.stringify(res.rows[0].value), BufferJSON.reviver);
    };

    const removeData = async (key) => {
        await pool.query('DELETE FROM baileys_auth_state WHERE key = $1', [key]);
    };

    const creds = (await readData('creds')) || initAuthCreds();

    return {
        state: {
            creds,
            keys: {
                get: async (type, ids) => {
                    const data = {};
                    await Promise.all(ids.map(async (id) => {
                        let value = await readData(`${type}-${id}`);
                        if (type === 'app-state-sync-key' && value) {
                            value = proto.Message.AppStateSyncKeyData.fromObject(value);
                        }
                        data[id] = value;
                    }));
                    return data;
                },
                set: async (data) => {
                    const tasks = [];
                    for (const category in data) {
                        for (const id in data[category]) {
                            const value = data[category][id];
                            const key = `${category}-${id}`;
                            tasks.push(value ? writeData(value, key) : removeData(key));
                        }
                    }
                    await Promise.all(tasks);
                }
            }
        },
        saveCreds: async () => {
            return writeData(creds, 'creds');
        }
    };
}

module.exports = { usePostgresAuthState };
