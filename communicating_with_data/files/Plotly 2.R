
library(plotly)
fig <- mtcars %>%
  plot_ly(x = ~mpg, y = ~disp)
fig

## Structure
  ## three  sets of functions: plot_ly, layout, and add_trace(add_*). 
      #plot_ly: allows R objects to be mapped to the Plotly library.
      #layout: control the chart title, axis labels and scales. 
      #add_trace function creates a geometry layer called a trace which is added to the chart.
        #There are many add_* functions. e.g.: add_bars, dd_boxplot..

    fig1 <- mtcars %>%
      plot_ly(x = ~mpg, y = ~disp) %>%
      layout(title = "Miles per Gallon vs Displacement",
             xaxis = list(title = "Miles per Gallon",
                          range = c(10, 35)),
             yaxis = list(title = "Displacement", range = c(50, 500)))
    
    fig1
    ###------ 
   
    fig2 <- mtcars %>%
      plot_ly(x = ~factor(cyl), y = ~mpg, type = "scatter", name = "Scatter")%>%
      add_boxplot(name = "Boxplot")
    fig2
    
    #--- geographical data
    
    df <- read.csv(
      'https://raw.githubusercontent.com/plotly/datasets/master/2015_06_30_precipitation.csv'
    )

###

fig3a <- df %>%
  plot_geo(lat = ~Lat, lon = ~Lon)
fig3a

###
fig3b <- fig3a %>%
  add_markers(
    text = ~paste("Precipitation:", Globvalue)
  ) 
fig3b
  
###

fig4 <- df %>%
  plot_geo(lat = ~Lat, lon = ~Lon) %>%
  add_markers(
    text = ~paste("Precipitation:", Globvalue),
    color = ~Globvalue,
    symbol = I("square"),
    size = I(8),
    hoverinfo = "text",
    opacity = I(0.8))
fig4

###

     