export function getRoundLabel(index: number): string {
  switch (index) {
    case 0:
      return 'Semifinal'
    case 1:
      return 'Semifinal'
    case 2:
      return 'Match for 3rd Place'
    case 3:
      return 'Final Match'
    default:
      return 'Warm-up Round'
  }
}
