	.file	"code.c"
	.text
	.globl	baz
	.type	baz, @function
baz:
	pushl	%ebp
	movl	%esp, %ebp
	subl	$16, %esp
	movl	$0, -4(%ebp)
	jmp	.L2
.L3:
	movl	-4(%ebp), %eax
	leal	0(,%eax,4), %edx
	movl	8(%ebp), %eax
	addl	%eax, %edx
	movl	16(%ebp), %eax
	movl	%eax, (%edx)
	addl	$1, -4(%ebp)
.L2:
	movl	-4(%ebp), %eax
	cmpl	12(%ebp), %eax
	jl	.L3
	movl	12(%ebp), %eax
	leave
	ret
	.size	baz, .-baz
	.section	.rodata
.LC0:
	.string	"Sum is %d\n"
	.text
	.globl	main
	.type	main, @function
main:
	leal	4(%esp), %ecx
	andl	$-16, %esp
	pushl	-4(%ecx)
	pushl	%ebp
	movl	%esp, %ebp
	pushl	%ecx
	subl	$84, %esp
	pushl	$16
	pushl	$16
	leal	-84(%ebp), %eax
	pushl	%eax
	call	baz
	addl	$12, %esp
	movl	%eax, -20(%ebp)
	movl	$0, -16(%ebp)
	movl	$0, -12(%ebp)
	jmp	.L6
.L7:
	movl	-12(%ebp), %eax
	movl	-84(%ebp,%eax,4), %eax
	addl	%eax, -16(%ebp)
	addl	$1, -12(%ebp)
.L6:
	cmpl	$15, -12(%ebp)
	jle	.L7
	subl	$8, %esp
	pushl	-16(%ebp)
	pushl	$.LC0
	call	printf
	addl	$16, %esp
	movl	$0, %eax
	movl	-4(%ebp), %ecx
	leave
	leal	-4(%ecx), %esp
	ret
	.size	main, .-main
	.ident	"GCC: (Ubuntu 7.5.0-3ubuntu1~18.04) 7.5.0"
	.section	.note.GNU-stack,"",@progbits
