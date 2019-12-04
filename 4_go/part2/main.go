package main

import (
	"fmt"
)

func checkNotDecreasing(w int) bool {
	lastdig := w % 10
	w /= 10
	var dig int

	for w > 0 {
		dig = w % 10
		w /= 10

		if dig > lastdig {
			return false
		}

		lastdig = dig
	}

	return true
}

func checkSame(w int) bool {
	group := w % 10
	w /= 10
	count := 1
	var dig int

	for w > 0 {
		dig = w % 10
		w /= 10

		if dig == group {
			count++

			if w == 0 && count == 2 {
				return true
			}
		} else {
			if count == 2 {
				return true
			}
			group = dig
			count = 1
		}
	}

	return false
}


func check(w int) bool {
	valid := checkNotDecreasing(w) && checkSame(w)

	if valid {
		fmt.Printf("%d\n", w)
	}
	return valid

	return checkNotDecreasing(w) && checkSame(w)
}

func main() {
	count := 0
	for i := 254032; i < 789860; i++ {
		if check(i) {
			count++
		}
	}

	fmt.Printf("Count: %d\n", count)
}
