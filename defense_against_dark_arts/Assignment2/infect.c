#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main()
{
	// buffer to store file
	char *buffer = (char *)malloc(sizeof(char) * 7328);

	// Read target.exe and open new file to infect.

	FILE *fileptr = fopen("target.exe", "rb");

	FILE *infptr = fopen("infected-target.exe", "wb");

	size_t bytes_read = fread(buffer, 1, 7328, fileptr);

	// MY CODE STARTS HERE:

	/*
	Notes:
		- Each of these defined char strings represents an instruction inserted into the executable.
		- The offset at each memcpy adds the previous offset until around 30, each +1 is a single byte.
		- The offset of the beginning of my injected code is at 0x447 indicated by the variable below.
	*/

	long file_offset = 0x447;

	char mv_ecx_esp[] = "\x8B\x0C\x24";

	memcpy(buffer + file_offset, mv_ecx_esp, sizeof(mv_ecx_esp) - 1);

	char mv_ecx_ebx[] = "\x89\xCB";

	memcpy(buffer + file_offset + 3, mv_ecx_ebx, sizeof(mv_ecx_ebx) - 1);

	char sub_0x112_ecx[] = "\x81\xE9\x12\x01\x00\x00";

	// now we should have the correct value for the string in memory
	memcpy(buffer + file_offset + 5, sub_0x112_ecx, sizeof(sub_0x112_ecx) - 1);

	char ecx_esp[] = "\x89\x0C\x24";

	memcpy(buffer + file_offset + 11, ecx_esp, sizeof(ecx_esp) - 1);

	char sub_0x186_ecx[] = "\x81\xE9\x86\x01\x00\x00";

	memcpy(buffer + file_offset + 14, sub_0x186_ecx, sizeof(sub_0x186_ecx) - 1);

	char mv_ecx_edi[] = "\x89\xCF";

	memcpy(buffer + file_offset + 20, mv_ecx_edi, sizeof(mv_ecx_edi) - 1);

	char call_ecx[] = "\xFF\xD1";

	memcpy(buffer + file_offset + 22, call_ecx, sizeof(call_ecx) - 1);

	char mv_ebx_esp[] = "\x89\x1C\x24";

	memcpy(buffer + file_offset + 24, mv_ebx_esp, sizeof(mv_ebx_esp) - 1);

	char call_edi[] = "\xFF\xD7";

	memcpy(buffer + file_offset + 27, call_edi, sizeof(call_edi) - 1);

	// insert leave and return to continue execution of previous code:

	buffer[file_offset + 29] = 0xC9;
	buffer[file_offset + 30] = 0xC3;

	// Here we prepare the location of the string in memory:

	long string_offset = 0x466;

	char my_string[] = "Wahoo Virus Activated!";

	memcpy(buffer + string_offset, my_string, strlen(my_string));

	buffer[string_offset + strlen(my_string)] = '\0';

	// End of my code.

	fwrite(buffer, 1, bytes_read, infptr);

	fclose(fileptr);
	fclose(infptr);
	free(buffer);
	return 0;
}
