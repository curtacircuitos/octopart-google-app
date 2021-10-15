# octopart-google-app

Inspired by [octopart.com/excel](http://octopart.com/excel) add-in, this add-on offer Google Docs integration for Octopart.

# Installation

This add-on was officially available at the Google Docs Add-on Store [here](https://chrome.google.com/webstore/detail/octopart/kcdciiomilaaihdaajihoodlgbemlbmc), but it is currently blocked due to lacking OAuth verification (see [this](https://github.com/curtacircuitos/octopart-google-app/issues/6) and [this](https://github.com/curtacircuitos/octopart-google-app/issues/9) issue).  That being said, it still works (as of October 2021) and it isn't hard to install manually using the files available here and the following steps:

1. From Google Sheets, select the Tools menu > Script Editor.  It will open an untitled project.  Rename it to "Octopart Google App" (or whatever you want).
2. When the script editor creates a new project, it also creates the file Code.gs by default.  Rename it to `functions` to match the first \*.gs file in this project (the .gs extension will be added automatically, so don't type it).  From the [code view of this project](https://github.com/curtacircuitos/octopart-google-app) click on functions.gs then on the button to "Copy raw contents".  Paste those contents into the script editor.
3. In the script editor add a new script file named `octopart` and copy the raw contents of octopart.gs from GitHub into it.  
4. Repeat for ui.gs.
5. Add sidebar.html in a similar way, but tell the script editor it is an HTML file rather than a script file.
6. Press CTRL-S to tell the script editor to save the project.

# Usage

1. If you don't already have one, create an account at [Octopart.com](https://octopart.com/) using your email address.
2. Somewhere in your Google Sheet (another tab is OK), set the user by entering this in a cell (using your email address) `=OCTOPART_SET_USER("your_email@address.com")`.  Note that you need quotes around your email address.  It make take a little time, but eventually that cell should show "Octopart Add-In is ready".
3. Try to look up some information.  For example, enter the following in some cells (these are just an example) of your Google Sheet:
   - In cell A10: `LIS2DW12TR`
   - In cell B10: `STMicroelectronics`
   - In cell C10: `=OCTOPART_DETAIL_URL(A10, B10)`
4. It should look up the Octopart URL for that part and display it, like this: https://octopart.com/lis2dw12tr-stmicroelectronics-77080925
5. In D10 try `=OCTOPART_DESCRIPTION(A10, B10)`
6. In E10 try `=OCTOPART_DISTRIBUTOR_STOCK(A10, B10,"Digi-Key")`
7. In F10 try `=OCTOPART_DISTRIBUTOR_STOCK(A10, B10)`
   - If it can't find the part, it displays "No offer found".  That is normally OK, but it causes problem if you are trying to find the sum of the parts at multiple distributors and one of them doesn't stock that part.  That can be dealt with like this (for Digi-Key and Mouser):  `=if(isnumber(OCTOPART_DISTRIBUTOR_STOCK(A10, B10,"Digi-Key")),OCTOPART_DISTRIBUTOR_STOCK(A10, B10,"Digi-Key"),0)+if(isnumber(OCTOPART_DISTRIBUTOR_STOCK(A10, B10,"Mouser")),OCTOPART_DISTRIBUTOR_STOCK(A10, B10,"Mouser"),0)`.

# Documentation

Documentation was available [here](http://octopart.com/google-docs), but the link is now broken.  

The video [here](https://octopart.com/blog/archives/2014/08/google-apps-add-on-paulos-open-source-project) does a nice job of demonstrating how it works.

Just type `=OCTOPART` and see what pops up.  It may not show every option, so keep typing if you want to see more, e.g. `=OCTOPART_DIST`.

# Screenshots

![Shot 1](/shot1.png?raw=true)
![Shot 2](/shot2.png?raw=true)
![Shot 3](/shot3.png?raw=true)

# Customization

There are pull requests [here](https://github.com/curtacircuitos/octopart-google-app/pulls) with additional functions.  If you know Javascript (or any C-like language) you can probably figure out how to make more following those and the original examples.
