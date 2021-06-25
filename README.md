# Nodejs-ocr-food-bot-slack
Nodejs OCR Food bot for slack

This is OCR(Optical character recognition) food bot for slack.

I made this bot because we have some "problems" in the company i was working for. 
In that company there was about 30 employees and we were using slack for chat, share file and of course we have food channel there.
Employees in a local restaurant where we going for lunch, publish food menu every day about 10am in one of the most popular social network, but the main problem is that they publish a menu like an image. So, I or someone of my collegues need to retype today's food from the menu in the food channel, then we like cirtain lunch and someone send SMS or email with lunch and quantity. This was pain in the a** for us, so i created bot.

In the certain time every day from monday to friday, cronjob will start the bot. Bot will go to the social network, grab the last published image, parse text from that image with OCR Space API, and put in the slack food channel. 
Then we like what we want to eat, and bot will grab that food names and quantities and send email or SMS to the local restaurant.

Watch on YT: https://www.youtube.com/watch?v=GirD3EBQ3GI


