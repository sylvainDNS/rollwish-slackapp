import fetch from 'node-fetch'
import uuidv4 from 'uuid/v4'
import moment from 'moment'
import { database, executeSql, config } from '../utils'
import { recover } from '../utils'
import { scrap } from '../scraper'

export const rollHandler = {
  get: () => {
    recover(
      executeSql(
        database,
        'SELECT product_id, title, price, productUrl, imageUrl, author FROM product WHERE playedAt IS NULL ORDER BY createdAt LIMIT 1;',
        []
      ),
      res => {
        const product = res[0]

        executeSql(
          database,
          'UPDATE product SET playedAt = ? WHERE product_id = ?;',
          [moment().format(), product.product_id]
        )

        const winValue = Math.floor(Math.random() * 10) + 1

        const body = {
          attachments: [
            {
              pretext: `*New product rolled !!* (added by ${product.author})`,
              title: product.title,
              title_link: product.productUrl,
              fields: [
                { title: 'Price', value: product.price, short: true },
                { title: 'Win value', value: winValue, short: true },
              ],
              image_url: product.imageUrl,
            },
          ],
        }

        return body
      },
      () => {
        const body = {
          text:
            'No more product stored in database, please send us a new product.',
        }

        return body
      }
    ).then(body => rollHandler.post(body, config.slack.channel))

    return { text: 'Product rolled' }
  },
  add: request => {
    const { text, response_url, user_name } = request.payload

    const prms = (async () =>
      await scrap(text.match(/^(.*?)(?=\?|$)/, '')[0]).then(value =>
        executeSql(
          database,
          'INSERT INTO product ( product_id, title, price, imageUrl, productUrl, author, createdAt ) VALUES ( ?, ?, ?, ?, ?, ?, ? );',
          [
            uuidv4(),
            value.title,
            value.price,
            value.imageUrl,
            value.productUrl,
            user_name,
            moment().format(),
          ]
        )
      ))()

    recover(
      prms,
      res => (res === true ? 'Wish product added' : res),
      err => err
    ).then(text => rollHandler.post({ text }, response_url))

    return { text: 'Adding requested product...' }
  },
  post: (text, responseUrl) => {
    return fetch(responseUrl, {
      method: 'post',
      body: JSON.stringify(text),
      headers: { 'Content-Type': 'application/json' },
    })
  },
}
