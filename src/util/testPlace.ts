import { PLACE_COORDINATES_REGEX } from '../constants'

export const isPlaceInputCorrect = (input: string): boolean => {
   return PLACE_COORDINATES_REGEX.test(input)
}