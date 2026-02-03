/*
CREATE TABLE ivdoc_bot.user_values (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_category_id BIGINT NOT NULL,

  value DECIMAL(10,2),
  raw_value VARCHAR(32),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_category_id) REFERENCES user_category(id)
) ENGINE=InnoDB;
*/