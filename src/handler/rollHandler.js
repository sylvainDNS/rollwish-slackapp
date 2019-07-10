import fetch from 'node-fetch'
import { badRequest } from '@hapi/boom'
import uuidv4 from 'uuid/v4'
import moment from 'moment'
import { database, executeSql } from '../utils'
import { recover } from '../utils'
import { scrap } from '../scraper'

export const rollHandler = {
  get: () => {
    const reply = recover(
      executeSql(
        database,
        'SELECT product_id, title, price, productUrl, imageUrl FROM product WHERE playedAt IS NULL ORDER BY createdAt LIMIT 1;',
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
              pretext: '*New product rolled !!*',
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
    )

    return reply
  },
  add: request => {
    const { text, response_url } = request.payload

    const prms = (async () =>
      await scrap(text.match(/^(.*?)(?=\?|$)/, '')[0]).then(value =>
        executeSql(
          database,
          'INSERT INTO product ( product_id, title, price, imageUrl, productUrl, createdAt ) VALUES ( ?, ?, ?, ?, ?, ? );',
          [
            uuidv4(),
            value.title,
            value.price,
            value.imageUrl,
            value.productUrl,
            moment().format(),
          ]
        )
      ))()

    recover(
      prms,
      res => {
        rollHandler.post(
          res === true ? 'Wish product added' : res,
          response_url
        )
        return res
      },
      err => {
        rollHandler.post(err, response_url)
        return badRequest(err)
      }
    )

    return { text: 'Adding requested product...' }
  },
  post: (text, responseUrl) => {
    const body = { text }
    return fetch(responseUrl, {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
  },
}
