-- Disslapp Database Schema

DROP DATABASE IF EXISTS disslapp;
CREATE DATABASE disslapp DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE disslapp;

-- Users table (both patients and psychologists)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    role ENUM('patient', 'psychologist') NOT NULL,
    patient_code VARCHAR(20) UNIQUE,
    xp INT DEFAULT 0,
    level INT DEFAULT 1,
    level_name VARCHAR(50) DEFAULT 'Explorador',
    streak INT DEFAULT 0,
    avatar VARCHAR(10),
    total_sessions INT DEFAULT 0,
    total_games_played INT DEFAULT 0,
    oauth_id VARCHAR(255),
    oauth_provider VARCHAR(50),
    last_login_date DATE,
    subscription_plan ENUM('free','pro','premium') NOT NULL DEFAULT 'free',
    subscription_status ENUM('active','inactive','canceled','trial') NOT NULL DEFAULT 'active',
    subscription_expires_at DATETIME,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Games table
CREATE TABLE games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    emoji VARCHAR(10),
    description TEXT,
    skill VARCHAR(100),
    level_required INT DEFAULT 1,
    type VARCHAR(50),
    max_stars INT DEFAULT 3,
    is_recommended BOOLEAN DEFAULT FALSE
);

-- Achievements catalog
CREATE TABLE achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    emoji VARCHAR(10),
    description TEXT,
    category VARCHAR(50)
);

-- User achievements unlock history
CREATE TABLE user_achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    achievement_id INT NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);

-- Game sessions history (duration_seconds tracks time for treatment metrics)
CREATE TABLE game_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    score INT DEFAULT 0,
    stars INT DEFAULT 0,
    xp_earned INT DEFAULT 0,
    completed BOOLEAN DEFAULT TRUE,
    duration_seconds INT DEFAULT 0,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);
