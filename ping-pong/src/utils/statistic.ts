interface GameStats {
  casual: {
    player1: number
    player2: number
    ai: number
    totalGames: number
  }
  tournament: {
    player1: number
    player2: number
    player3: number
    player4: number
    totalTournaments: number
  }
}

const LOCAL_STORAGE_KEY = 'pongGameStats'

export const loadStats = (): GameStats => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (!stored) {
    return {
      casual: {
        player1: 0,
        player2: 0,
        ai: 0,
        totalGames: 0,
      },
      tournament: {
        player1: 0,
        player2: 0,
        player3: 0,
        player4: 0,
        totalTournaments: 0,
      },
    }
  }
  return JSON.parse(stored)
}

export const saveStats = (stats: GameStats) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stats))
}
