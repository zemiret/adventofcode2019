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
	var a[10]int
	var dig int

	for w > 0 {
		dig = w % 10
		w /= 10

		a[dig]++
	}

	for i := 0; i < 10; i++ {
		if a[i] > 1 {
			return true
		}
	}

	return false
}


func check(w int) bool {
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
