CREATE TABLE product ( 
    product_id TEXT,
    title TEXT,
    price TEXT,
    imageUrl TEXT,
    productUrl TEXT,
    author TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    playedAt DATETIME,
    CONSTRAINT product_pk PRIMARY KEY (product_id)
);