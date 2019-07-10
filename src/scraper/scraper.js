import Puppeeter from 'puppeteer'
import { config } from '../utils/config'

export const scrap = async url => {
  const browser = await Puppeeter.launch({
    headless: config.node.env !== 'development',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const datas = await getProductDataFromUrl(browser, url)
  browser.close()

  return datas
}

const getProductDataFromUrl = async (browser, url) => {
  const page = await browser.newPage()

  await page.setViewport({
    width: 1280,
    height: 720,
  })

  await page.goto(url)
  await page.waitFor('.modal-root')

  await page.click(
    'div.AuthenticationModal__AuthenticationButtonWrapper-li0874-10.AuthenticationModal__LoginButton-li0874-20.fefVfW'
  )

  await page.type('[data-id="emailAddress"]', config.puppeeter.wish.email)
  await page.type('[data-id="password"]', config.puppeeter.wish.password)

  await page.click(
    'div.AuthenticationModal__AuthenticationButtonWrapper-li0874-10.AuthenticationModal__LoginButton-li0874-20.eRoIZN'
  )

  await page.waitFor('div.ProductModal__MainContent-sc-1dd50st-1.houobb')

  const scrapedProduct = await page.evaluate(() => {
    const title = document.querySelector(
      'h1.PurchaseContainer__Name-sc-1qlezk8-1'
    ).innerHTML
    const price = document.querySelector(
      'div.PurchaseContainer__ActualPrice-sc-1qlezk8-6'
    ).innerHTML
    const imageUrl = document
      .querySelector('div.ProductImageContainer__Wrapper-s90bs8-0 > img')
      .src.match(/^(.*?)(?=\?|$)/, '')[0]

    return { title, price, imageUrl }
  })

  await page.close()

  return { ...scrapedProduct, productUrl: url }
}
