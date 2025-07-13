export const isPlaceInputCorrect = (input: string): boolean => {
   return /^PLACE \d+,\d+,(NORTH|EAST|SOUTH|WEST)$/i.test(input)
}