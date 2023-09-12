#include <stdio.h>
#define BUFSIZE 16

int baz(int vector[], int len, int value) {
 int i;
 for (i = 0; i < len; i++)
    vector[i] = value;
 return len;
}

int main() {
 int x, i, sum;
 int buffer[BUFSIZE];
 x = baz(buffer, BUFSIZE, 16);
 sum = 0;
 for (i = 0; i < BUFSIZE; i++)
    sum += buffer[i];
 printf ("Sum is %d\n", sum);
 return 0;
}

