// database.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '104.155.173.175',
    user: 'nume',
    password: 'nume',
    database: 'hihome',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/**

async function initialize() {
    const connection = await pool.getConnection();
    
    await connection.query(`
    CREATE TABLE IF NOT EXISTS Control_Usa (
        id INT AUTO_INCREMENT PRIMARY KEY,
        door_name VARCHAR(255) NOT NULL,
        status BOOLEAN NOT NULL DEFAULT 0
    )
    `);
    
    const doors = [
        { door_name: 'Front Door', status: false },
        { door_name: 'Back Door', status: false },
        { door_name: 'Garage Door', status: false }
    ];
    
    for (const door of doors) {
        try {
            await connection.query(
                'INSERT INTO doors (door_name, status) VALUES (?, ?)',
                [door.door_name, door.status]
            );
        } catch (error) {
            if (error.code !== 'ER_DUP_ENTRY') {
                throw error;
            }
        }
    }
    
    
    connection.release();
}

initialize();

*/

module.exports = pool;
