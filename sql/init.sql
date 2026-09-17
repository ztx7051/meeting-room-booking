DROP TABLE IF EXISTS bookings;

DROP TABLE IF EXISTS users;

DROP TABLE IF EXISTS rooms;

CREATE TABLE
    users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM ('user', 'admin') NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE
    rooms (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        capacity INT UNSIGNED NOT NULL,
        location VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE 
    bookings(
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        room_id INT UNSIGNED NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
        FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        status ENUM('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO users (username,password_hash,role) VALUES ('alice','123456','admin');
INSERT INTO users (username,password_hash,role) VALUES ('bob','123456','user');

INSERT INTO rooms (name,capacity,location) VALUES ('Conference Room A',10,'First Floor');
INSERT INTO rooms (name,capacity,location) VALUES ('Conference Room B',20,'Second Floor');
INSERT INTO rooms (name,capacity,location) VALUES ('Conference Room C',15,'Third Floor');
INSERT INTO rooms (name,capacity,location) VALUES ('Conference Room D',25,'Fourth Floor');

INSERT INTO bookings (user_id,room_id,start_time,end_time,status) VALUES (1,1,'2026-09-18 09:00:00','2026-09-18 10:00:00','confirmed');
INSERT INTO bookings (user_id,room_id,start_time,end_time,status) VALUES (2,2,'2026-09-18 11:00:00','2026-09-18 12:00:00','confirmed');
INSERT INTO bookings (user_id,room_id,start_time,end_time,status) VALUES (1,2,'2026-09-10 11:00:00','2026-09-10 13:00:00','confirmed');
