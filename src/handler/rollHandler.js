import { badRequest } from '@hapi/boom'
import moment from 'moment'
import { database, executeSql } from '../utils'
import { recover } from '../utils'

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
}
