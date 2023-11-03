#!C:\Strawberry\perl\bin\perl.exe

use strict;
use CGI;

my $cgi = CGI->new;
print $cgi->header;

my $first_name = $cgi->param('first-name');
my $last_name = $cgi->param('last-name');

print "<!DOCTYPE html>\n";
print "<html>\n";
print "<head>\n";
print "    <title>Name Display</title>\n";
print "</head>\n";
print "<body>\n";
print "    <h1>Welcome, $first_name $last_name!</h1>\n";
print "</body>\n";
print "</html>\n";