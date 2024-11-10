---
author: Anshul Sharma
pubDatetime: 2024-11-10T14:00:04.380Z
title: How to make a dynamic dashboard using Google Sheets
slug: dynamic-dashboard-in-google-sheets-tutorial
featured: true
draft: false
tags:
  - learning
  - googlesheets
  - spreadsheets
  - analytics
  - tutorials
description: In this tutorial, we will make a simple dashboard using google sheets. Create cascading drop-down menu filters. In a cascading drop-down,  the the drop-down options of one drop-down change based on the selection in another drop-down.
ogImage: /src/assets/images/google-sheets-dashboard/googlsheets_dashboard_banner.png
githubLink: 
link: https://docs.google.com/spreadsheets/d/11fV9HW1sYN5n63QN-CIRdPKHcfXtyLOYXhRlpCB6500/edit?usp=sharing
---

![](/src/assets/images/google-sheets-dashboard/googlsheets_dashboard.gif)

*Cascading Menus: The second drop-down (Country) updates based on the selection of the first drop-down (Region)*

Imagine you are a start to mid-level analyst or manager at a highly data driven organization. Part of your routine work is to deal with the same set of data, churn actionable insights from it and report it to a broader team. If expensive BI tools like Tableau and Qlikview are overkill for your requirement, then read further.

With the power of [Googl](https://www.google.com/sheets/about/)[e](https://www.google.com/sheets/about/) [Sheets](https://www.google.com/sheets/about/), anyone can create functional and dynamic dashboards which can be shared with a number of people for consumption. In this tutorial, we will make a simple dashboard using google sheets.

**Note:** You can create a similar dash in [MS Excel](https://products.office.com/en-in/excel) as well with slight modifications,  
but we will cover the various excel equivalents for Google Sheets functions in a later tutorial.   
You can also use the powerful [Pivot Tables](https://support.google.com/docs/answer/1272900?hl=en&co=GENIE.Platform%3DDesktop) to create similar summaries,  
however, those are limited in functionality and not ideal to share  
with others in form of an intuitive dashboard interface.

In this tutorial, we will learn the following:

*   Use a sample sales data to create a summary of "units sold" aggregated by "item type" and by week/month/year of the "order date".
*   Create cascading drop-down menu filters. In a cascading drop-down, the the drop-down options of one drop-down change based on the selection in another drop-down.
*   Add an "ALL" option in the drop-down filters to select multiple values. Use conditional formatting to highlight any input errors.
*   Share the dashboard with others in a "safe" way by protecting sheets
*   Next steps on how to make the dashboard more dynamic

Resources
---------

[Sample data](http://eforexcel.com/wp/wp-content/uploads/2017/07/1000-Sales-Records.zip)

*Courtsey [E for Excel](http://eforexcel.com/wp/downloads-18-sample-csv-files-data-sets-for-testing-sales/). Note that I updated the Order Date column to more recent dates.*

[Final Dashboard](https://docs.google.com/spreadsheets/d/11fV9HW1sYN5n63QN-CIRdPKHcfXtyLOYXhRlpCB6500/edit?usp=sharing)

In Google Sheets

List of major functions we will learn about:

*   [SUMIFS](https://support.google.com/docs/answer/3238496?hl=en)
*   [FILTER](https://support.google.com/docs/answer/3093197?hl=en)
*   [UNIQUE](https://support.google.com/docs/answer/10522653?hl=en&sjid=8018780142411430650-EU)
*   [SORT](https://support.google.com/docs/answer/3093150?hl=en)

Getting Started
---------------

*   Copy and paste the sample data into a back-end sheet. As a good practice, I prefix my back-end data sheets with "DATA\_" and also give them a unique sheet color.
   ![](/src/assets/images/google-sheets-dashboard/raw_data.png)

*   Also create a new tab and call it "Summary" where all the action will happen.

Define Values, Dimensions and Filters
-------------------------------------

![](/src/assets/images/google-sheets-dashboard/dashboard_structure.png)

  

*   For the rest of the tutorial, we will use the following terms:
*   **Values:** The values/metrics which you want to see aggregated. Eg. Number of Units Sold, Total Revenues , Profit per Unit etc.
*   **Dimensions:** The dimensions across which the values will be aggregated. In this example, I am aggregating _\# Units Sold_ across two dimensions: _Item Type_ and _Week_ in which order was placed (Monday of the week of order date)
*   **Filters:** Additional filters to slice the data. In this example, I am using _Region_ and _Country_ as two filters. Note that country is a complete sub-set of Region (eg. _India_ will always fall under _Asia_ region and never under any other region)

> **Pro Tip:** I prefer to use a consistent color scheme for all input cells.  
> In this case the only "inputs" by a user are the values of the drop-down filters (Region and Country). Hence they are color coded in mild yellow to let the user know that it can be changed.

Once we have created a basic structure for your dash, we move to the fun stuff, creating cascading menu drop-downs for your filters.

Creating cascading drop-down menus
----------------------------------

*   First we create the list of items for the first drop-down (Region). The way data-validation based drop-downs work in Google Sheets is that they display a unique set of values from a selected range, in the same order as the values appear in the range. In our [sample dashboard](https://docs.google.com/spreadsheets/d/11fV9HW1sYN5n63QN-CIRdPKHcfXtyLOYXhRlpCB6500/edit?usp=sharing), we prepare the _Region_ list by first getting a unique set of values of the _Region_ column from our _RAW\_DATA_ sheet, and then sorting the output in alphabetical order using the sort function. We populate the sorted results in Cell _A6_ of the Summary sheet.
*   Notice that we have left a static value "ALL" in cell _A5_. I will come to that later.

`=SORT(UNIQUE(DATA\_RAW!$A$3:$A$2002),1,TRUE)`   
`// first takes unique values from range DATA_RAW!$A$3:$A$2002`    
`and then sort the results in alphabetical order`

Puzzled by the varied use of the $ dollar sign in the formulas?  
Read more about cell referencing in Google Sheets [here](https://edu.gcfglobal.org/en/googlespreadsheets/types-of-cell-references/1/)

*   The last step is to populate these results in our _Region_ drop-down on cell _D3_. For this, we select the cell _D3_, go to Data > Data Validation, under _Criteria_, select _List from a range_, and select the the entire range of values in Column A (_'Summary'!A5:A100_). Make sure the "Show drop-down list in cell" option is checked. Once done, the list will start appearing in in cell _D3_ as a drop-down. Notice that blanks are ignored in the drop-down list and it shows up in same order (Alphabetical).
*   ![](/src/assets/images/google-sheets-dashboard/drop_down.png)
*   Now, we use a similar formula to populate the values of our second drop-down (_Country_) in cell _B6_ of the summary sheet, but with **one major difference**: The values for Country drop-down should change based on what is selected in the _Region_ drop-down.
*   For this, we make use of the FILTER function. The sequence is as follows: First we filter for _Country_ column values in *RAW_DATA* sheet conditional on the values in the _Region_ column on the same sheet. Once we have the filtered Country values based on our selected Region, we apply the functions similar to our previous step to make our results unique and then sort them alphabetically
*   Finally, for completeness I wrap our output inside an [IFERROR](https://support.google.com/docs/answer/3093304?hl=en) function to ensure the _Country_ list does not throw a Filter error when "ALL" is selected under _Region_. In case of such an error, I make the _Country_ list empty. I also add a "ALL" static value in cell _B5_ (will come to its use later)

`=IFERROR(SORT(UNIQUE(FILTER(DATA_RAW!$B$3:$B$2002,DATA_RAW!$A$3:$A$2002=$D$3)),1,TRUE),"")`   
  
`// Select Country input values (DATA_RAW!$B$3:$B$2002)`   
`ONLY if the corresponding Region input values (DATA_RAW!$A$3:$A$2002)`   
`are equal to our currently selected Region in Summary ($D$3)`

*   Now we again follow the  steps similar to the _Region_ drop-down, and use data validation to populate the _Country_ drop-down in cell E3.
*   Viola! we have the cascading drop-downs working, with the _Country_ drop-down values changing based on the _Region_ drop-down values.

Dynamically populating the dimensions (row and column headers)
--------------------------------------------------------------

*   Our original selection for row headers was _Item Type_ and for Column headers was the Week containing the Order Date (A week is represented by the date on Monday of that week). Although for simple summaries where the dimension values don't change, we can just manually populate static values for the two dimensions. However, for this exercise, I want both the dimension values to be dynamically populated from _RAW\_DATA_
*   For row headers, we use the same UNIQUE and SORT functions (refer to the previous cascading menu step) to populate all unique values of _Item Type_ from _RAW\_DATA_ and also sort them alphabetically.
*   For column headers, I want to populate the latest 4 weeks of data based on the _Order Date_ in _RAW\_DATA_.

In cell H5  
`=MAX(DATA\_RAW!$F$3:$F$2002) - WEEKDAY(MAX(DATA\_RAW!$F$3:$F$2002),3)`  
  
`// MAX function pulls the largest date value (most recent) from`  
`the range DATA_RAW!$F$3:$F$2002. Then we use the WEEKDAY function to subtract the number of weekdays past since Monday of that week. This way we always end up with the Monday of the week of Order Date, regardless of the date`

Aggregating data based on your filters and dimensions
-----------------------------------------------------

*   Finally, we use the versatile SUMIFS formula to conditionally sum the _Units Sold_ column from _RAW\_DATA_ sheet. The conditions are applied on _Region_, _Country_, _Item Type_ and _Order Date_
*   SUMIFS in its simplest form is very simple to understand. Taking our example, we enter the following formula on cell _E6_ in _Summary_:

`In Cell E6`  
`=SUMIFS(DATA_RAW!$I:$I,DATA_RAW!$A:$A,_$D$3,DATA_RAW!$B:$B,_$E$3,DATA_RAW!$C:$C,$D6,DATA_RAW!$F:$F,">="&E$5,DATA_RAW!$F:$F,"<="&E$5+6)`

*   The above formula explained in English is as follows: SUM the values in range _DATA\_RAW!$I:$I_ ONLY for selected rows where
    *   _Region_ is our selected region (_DATA_RAW!$A:$A = $D$3)_
    *   AND _Country_ is our selected country (_DATA\_RAW!$B:$B = $E$3_)
    *   AND _Item Type_ is same as my current row's header_Item Type_ (DATA\_RAW!$C:$C = $D6)
    *   AND _Order Date_ is between Monday as per my current column's header and Monday+6 (DATA\_RAW!$F:$F,">="&E$5 & DATA_RAW!$F:$F,"<="&E$5+6)
*   Now we can drag this formula across our summary table. Just hide the Filter value columns A and B and that's it! We have a functional dashboard!

Final touches to make the interface more user friendly
------------------------------------------------------

*   Using "ALL" option to select all Regions and/or countries:
    *   In the SUMIFS function, if we use the asterisk (\*) as a criteria value, the SUMIFS function ignores the entire criteria. So we need to tell the function to replace "ALL" value from drop-down with "\*" every time "ALL" is selected. The modified function is:

In cell E6  
`=SUMIFS(DATA_RAW!$I:$I,DATA_RAW!$A:$A,IF($D$3="ALL","\*_",$D$3),DATA_RAW!$B:$B,IF($E$3="ALL","\*_",$E$3),DATA_RAW!$C:$C,$D6,DATA_RAW!$F:$F,">="&E$5,DATA_RAW!$F:$F,"<="&E$5+6)`

*   Add additional conditional formatting to highlight errors in drop-down values. In our example, if the user enters a value which is not part of the drow-down list, the color of the drop-down will turn from mild yellow to red to highlight the error.
    *   For this, select the drop-downs at cell D3 and E3, go to Format > Conditional Formatting. Add something like this:
    *   ![](/src/assets/images/google-sheets-dashboard/formatting_1.png)![](/src/assets/images/google-sheets-dashboard/formatting_2.png)
    *   `=ISERROR(MATCH($E$3,$B$5:$B$100,0))`

*   Before sharing your new dashboard with others for consumption, you should [protect the sheets](https://support.google.com/docs/answer/1218656?co=GENIE.Platform%3DDesktop&hl=en) so that other users cannot modify any formulas in the sheet. While you are protecting your sheet, add the Filter drop-down cells (_D3_ and _E3_) under exceptions (_Except certain cells_). This way, the only cells the users can change in the sheet are the ones that you want them to change.
*   You can add more summaries of different values and dimensions. Some ideas based on the data in current example are:
    *   Value = SUM of _Profit_ / SUM of _Unit Sold_ (profit per unit), Dimensions = by Week and by Country and Filter being _Item Type_ in the drop-down
    *   Measuring Average Lag between Shipping Date and Order Date: Value = Average of (Shipping Date minus Order Date), Dimension = by _Order Priority_ and by_Item Type,_ Filters = Region and Country. In this scenario where were are aggregating as Averages, you should use AVERAGEIFS instead of SUMIFS

I hope this tutorial was useful and easy to understand. For any questions or feedback, you can comment on this post below.

~ Fin ~
