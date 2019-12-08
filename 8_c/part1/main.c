#include <stdio.h>
#include <stdlib.h>

#define WIDTH 25
#define HEIGHT 6
#define LAYER_SIZE (WIDTH * HEIGHT)

int calculate(int *img, long size);
int *readfile(FILE *img, long size);

int main() {
	FILE *f = fopen("input", "r");
	fseek(f, 0, SEEK_END);
	long size = ftell(f) - 1;
	fseek(f, 0, SEEK_SET);

//	printf("Layer size: %d\n", LAYER_SIZE);
//	printf("Sie %ld\n", size);

	int *img = readfile(f, size);
	fclose(f);

	printf("Res: %d\n", calculate(img, size));

	free(img);

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
		res[i] = (int)strtol(&s, NULL, 10);
	}

	return res;
}
