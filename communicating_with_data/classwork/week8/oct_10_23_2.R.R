
library(readr)

Ranking<-read.csv("../data/World_University_Rankings_2023.csv")
View(ranking)
library(ggplot2)
library(dplyr)

#
ggplot(filter(Ranking,OverAll.Score!="NA"),aes(y=OverAll.Score))+
geom_boxplot()
#color: outlier
ggplot(filter(Ranking,OverAll.Score!="NA"),aes(y=OverAll.Score))+
geom_boxplot(outlier.color = "red")

ggplot(filter(Ranking,OverAll.Score!="NA"),aes(x=Location,y=OverAll.Score))+
geom_boxplot(outlier.color = "red")

#color+2 var
ggplot(filter(Ranking,OverAll.Score!="NA"),aes(x=Location,y=OverAll.Score))+
geom_boxplot(outlier.color = "red")+coord_flip()

ggplot(filter(Ranking,OverAll.Score!="NA"),aes(x=Location,y=OverAll.Score,fill=Location))+
geom_boxplot(outlier.color = "red")

ggplot(filter(Ranking,OverAll.Score!="NA"),aes(x=Location,y=OverAll.Score,fill=Location))+
geom_boxplot(outlier.color = "red")+scale_fill_viridis_d(option = "magma")

#?scale_fill_viridis_d()
#?element_text()

ggplot(filter(Ranking,OverAll.Score!="NA"),aes(x=Location,y=OverAll.Score,fill=Location))+
  geom_boxplot(outlier.color = "red")+scale_fill_viridis_d(option = "magma")+theme(axis.text.x = element_text(angle = 90))#,legend.position = "none")


####

ggplot(Ranking, aes(x=OverAll.Score))+geom_histogram()
sqrt(200)
ggplot(Ranking, aes(x=OverAll.Score))+geom_histogram(bins = 14)
ggplot(Ranking, aes(x=OverAll.Score))+geom_histogram(bins = 14,na.rm = T)
ggplot(filter(Ranking,OverAll.Score!="NA"),aes(x=OverAll.Score))+geom_histogram(bins=14)
ggplot(filter(Ranking,OverAll.Score!="NA"),aes(x=OverAll.Score))+geom_histogram(bins=14,color="black", fill="skyblue")
ggplot(filter(Ranking,OverAll.Score!="NA"),aes(x=OverAll.Score, fill=Location))+geom_histogram(bins=14,color="black")
ggplot(filter(Ranking,OverAll.Score!="NA"),aes(x=OverAll.Score, fill=Location))+geom_histogram(bins=14,color="black")+scale_fill_viridis_d(option = "turbo")
ggplot(filter(Ranking,OverAll.Score!="NA"),aes(x=OverAll.Score, fill=Location))+geom_histogram(bins=14,color="black")+scale_fill_viridis_d(option = "turbo", direction = -1)


