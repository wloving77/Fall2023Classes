#include <stdio.h>
#include <stdlib.h> 
#include <string.h>

int main() {

	// buffer to store file
	char * buffer = (char *) malloc(sizeof(char) * 7328);

	//Read target.exe and open new file to infect.
	
	FILE * fileptr = fopen("target.exe", "rb");

	FILE * infptr = fopen("infected-target.exe", "wb"); 

	size_t bytes_read = fread(buffer,1,7328,fileptr);

	// MY CODE STARTS HERE:
	
	//offset of NOP list in target.exe	
	long jmp_offset = 0x44C;
	
	//how far I want to jump, just 2 bytes forward
	long relative_offset = 2; 

	buffer[jmp_offset] = 0xE9;

	memcpy(buffer + jmp_offset + 1, &relative_offset, sizeof(relative_offset)-4);

	//add original leave instruction
	buffer[jmp_offset + 5] = 0xC9;
	
	//add original return instruction
	buffer[jmp_offset + 6] = 0xC3;

	//JMP INSTRUCTION LOADED, NOW WRITING STRING TO 0x465
	
	long string_offset = 0x465;

	char my_string[] = "Wahoo Virus Activated!\0";

	size_t string_length = strlen(my_string); 

	memcpy(buffer + string_offset, my_string, string_length);

	
	//STRING + JMP LOADED:
  	

	//hopefully end of instruction code; 

	fwrite(buffer, 1, bytes_read, infptr);

	fclose(fileptr);
	fclose(infptr);
	free(buffer);
	return 0;



}
