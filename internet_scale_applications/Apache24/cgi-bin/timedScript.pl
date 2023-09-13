#!C:\Strawberry\perl\bin\perl.exe

use CGI qw(:standard);
my $q=CGI->new;
my $option=$q->param("option");
print "Content-type:text/html\r\n\r\n";
print "Generate a pause for " . $option . "\n";
sleep($option);
print "Ok, I'm Done.";
