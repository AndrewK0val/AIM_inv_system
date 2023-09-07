import express from 'express';
import fs from 'fs';

const app = express();

app.get("/items/out-of-stock-count", (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
      return;
    }

    const items = JSON.parse(data).items;
    const count = countItemsOutOfStock(items);
    res.json({ count });
  });
});

function countItemsOutOfStock(items) {
  let count = 0;
  for (const item of items) {
    if (item.quantity === 0) {
      count += 1;
    }
  }
  return count;
}

app.listen(3000, () => {
  console.log('Server listening on port 3007');
});