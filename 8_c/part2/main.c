#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <ncurses.h>

#define WIDTH 25
#define HEIGHT 6
#define LAYER_SIZE (WIDTH * HEIGHT)
#define BLACK 0
#define WHITE 1
#define TRANS 2

int calculate(int *img, long size);
int *readfile(FILE *img, long size);
int *decode(int *img, long size);
void print(int *img);


int main() {
	FILE *f = fopen("input", "r");
	fseek(f, 0, SEEK_END);
	long size = ftell(f) - 1;
	fseek(f, 0, SEEK_SET);

	int *img = readfile(f, size);
	fclose(f);

	initscr();
	noecho();

	start_color();
	init_pair(1, COLOR_GREEN, COLOR_GREEN);
	init_pair(2, COLOR_WHITE, COLOR_WHITE);
	clear();


	int *decoded = decode(img, size);
	print(decoded);

	getch();

	free(img);
	free(decoded);

	endwin();

	return 0;
}

int calculate(int *img, long size) {
	int min = size + 1;
	int ones = 0;
	int twos = 0;
	int zeros = 0;
	int res = 0;
	int layers = size / LAYER_SIZE;

	for (int i = 0; i < layers; ++i) {
		zeros = 0;
		ones = 0;
		twos = 0;

		for (int j = (i * LAYER_SIZE); j < ((i + 1) * LAYER_SIZE); ++j) {
			int pix = img[i * LAYER_SIZE + j];

			if (pix == 0) {
				++zeros;
			} else if (pix == 1) {
				++ones;
			} else if (pix == 2) {
				++twos;
			}
		}

		if (zeros < min) {
			min = zeros;
			res = ones * twos;
		}
	}

	return res;
}

int *readfile(FILE *img, long size) {
	int *res = (int *)malloc(size * sizeof(int));

	for (int i = 0; i < size; ++i) {
		char s = (char)fgetc(img);
		res[i] = s - '0';
	}

	return res;
}

int *decode(int *img, long size) {
	int *res = (int *)malloc(LAYER_SIZE * sizeof(int));

	for (int i = 0; i < size; ++i) {
//		printf("%d\n", img[i]);
	}

	for (int i = 0; i < LAYER_SIZE; ++i) {
		res[i] = TRANS;
		int j = i;

		while (img[j] == TRANS && j < size) {
			j += LAYER_SIZE;
		}

		if (j >= size) {
			printf("KIIIILLLL\n");
		}

		res[i] = img[j];
	}


	return res;
}

void print(int *img) {
	for (int i = 0; i < HEIGHT; ++i) {
		for (int j = 0; j < WIDTH; ++j) {
			int pix = img[i * WIDTH + j];

			if (pix == BLACK) {
				attron(COLOR_PAIR(1));
				mvaddch(i, j, ' ');
				attroff(COLOR_PAIR(1));
			} else if (pix == WHITE) {
				attron(COLOR_PAIR(2));
				mvaddch(i, j, ' ');
				attroff(COLOR_PAIR(2));
			} 
		}
	}

	refresh();
}
