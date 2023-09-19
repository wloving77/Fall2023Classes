
library(dplyr)
library(readxl)
cd<-read_xlsx("data/DS_ Class_Data-1.xlsx")

##colnames

## create traveler 
cd2<-mutate(cd,traveler=ifelse(States<20,"Keep it up","Explorers"))

#traveler column and unique value

#ifelse
cd3<-cd%>%
  mutate(traveler=ifelse(States<20,"Keep it up",
                         ifelse(States<35,"Explorers",
                               ifelse(States<45,"Avid travelers","conquerer"))))
head(cd3)

## Pattern Matching and Replacement
table(cd$Major)
grepl("con",cd$Major)
?grepl

## mutate_all
cd4<-cd%>%
  mutate(degree=ifelse(grepl("con",Major),"Economics",Major))
table(cd4$degree)

#Extract or replace substrings in a character vector.
substr(cd$BirthMonth,1,3)
?substr

library(stringr)
table(cd$Summer)

#Count the number of matches in a string
str_count(cd$Summer,"durat")
str_count(cd$Summer,"ducat")
sum(str_count(cd$Summer,"ducat"))


cd$Summer

######### 

library(ggplot2)
ggplot(data=cd,mapping = aes(x=Age))+geom_boxplot()
ggplot(cd,aes(x=Age))+geom_boxplot()
cd%>%
ggplot(aes(x=Age))+geom_boxplot()
cd%>%
mutate(Sleep=as.numeric(gsub("`","",Sleep)))%>%
ggplot(aes(x=Sleep))+geom_boxplot()
