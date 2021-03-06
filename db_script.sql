  CREATE TABLE `posts`(
    `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `owner_id` int,
    `content` varchar(255) NOT NULL,
    `post_timestamp` timestamp DEFAULT CURRENT_TIMESTAMP,
    `picture` varchar(128)
  );

  CREATE TABLE `users`(
    `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `name` varchar(45) NOT NULL,
    `username` varchar(45) UNIQUE NOT NULL,
    `email` varchar(64) UNIQUE NOT NULL,
    `password` varchar(64) NOT NULL,
    `description` varchar(128),
    `location` varchar(45),
    `webpage` varchar(128),
    `picture` varchar(128)
  );

  CREATE TABLE `comments`(
    `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `user_id` int,
    `post_id` int,
    `content` varchar(128) NOT NULL
  );

  CREATE TABLE `users_have_posts`(
    `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `user_id` int,
    `post_id` int
  );

  CREATE TABLE `posts_have_likes`(
    `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `post_id` int,
    `user_id` int
  );

  CREATE TABLE `comments_have_likes`(
    `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `comment_id` int,
    `user_id` int
  );

  ALTER TABLE `comments` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

  ALTER TABLE `comments` ADD FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

  ALTER TABLE `users_have_posts` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

  ALTER TABLE `users_have_posts` ADD FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

  ALTER TABLE `posts` ADD FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

  ALTER TABLE `posts_have_likes` ADD FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

  ALTER TABLE `posts_have_likes` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

  ALTER TABLE `comments_have_likes` ADD FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

  ALTER TABLE `comments_have_likes` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
