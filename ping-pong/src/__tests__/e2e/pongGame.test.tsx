/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test'

test('full pong game flow to casual game win', async ({ page }) => {
  await page.goto('http://localhost:3000')

  const noButton = page.getByRole('button', { name: 'no' })
  await expect(noButton).toBeVisible()
  await noButton.click()

  const playersMode = page.locator('[data-testid="playersMode"]')
  await expect(playersMode).toBeVisible()
  await playersMode.click()

  const middleSizePaddle = page
    .locator('div')
    .filter({ hasText: /^Paddle size:SmallMediumLarge$/ })
    .getByRole('combobox')

  await expect(middleSizePaddle).toBeVisible()

  const lvl = page
    .locator('div')
    .filter({ hasText: /^Obstacle:Clear SkyStatic TroubleChaos Mode$/ })
    .getByRole('combobox')
  await expect(lvl).toBeVisible()

  const startBtn = page.getByRole('button', { name: 'Start the game' })
  await expect(startBtn).toBeVisible()
  await startBtn.click()

  // when game started
  // check that canvas is here
  const canvasColor = await page.evaluate(() => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return null
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    const imageData = ctx.getImageData(10, 10, 1, 1)
    const data = imageData.data
    return { r: data[0], g: data[1], b: data[2], a: data[3] }
  })
  if (!canvasColor) {
    throw new Error('Canvas or context not found')
  }
  expect(canvasColor).not.toBeNull()
  expect(canvasColor.a).toBe(255)
  console.log(canvasColor.r, canvasColor.g, canvasColor.b, canvasColor.a)

  // check for players
  const leftPlayer = page.getByRole('img', { name: 'player left' })
  await expect(leftPlayer).toBeVisible()
  const lives = page.locator('[data-testid="livesSector1"] div')
  await expect(lives).toBeVisible()
  const fullHeartsL = page
    .locator('[data-testid="livesSector1"]')
    .getByRole('img', { name: 'heart' })
  await expect(fullHeartsL).toHaveCount(5)
  for (let i = 0; i < 5; i++) {
    await expect(fullHeartsL.nth(i)).toBeVisible()
  }
  const countL = await fullHeartsL.count()
  console.log('Number of full hearts L:', countL)

  const rightPlayer = page.getByRole('img', { name: 'player right' })
  await expect(rightPlayer).toBeVisible()
  const fullHeartsR = page
    .locator('[data-testid="livesSector2"]')
    .getByRole('img', { name: 'heart' })
  await expect(fullHeartsR).toHaveCount(5)
  for (let i = 0; i < 5; i++) {
    await expect(fullHeartsR.nth(i)).toBeVisible()
  }
  const countR = await fullHeartsL.count()
  console.log('Number of full hearts R:', countR)

  //   const paddleA = page.locator('[data-testid="paddleA"]')
})
