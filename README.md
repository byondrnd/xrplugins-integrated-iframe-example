# Integrated-frame.

=> install dependencies using "yarn"

=> To run project Run "yarn serve"

=> To watch errors and activities run "tsc ts"

=> inside src folder we have app.ts file on which we have injected two functions emit and listen events in iframe.

=> in public folder we have index.html for playground and iframe.html for hosting webpage.

=> Event logger which shows emitted events.

=> generate events section which will pass events data to iframe using postmessage.

=> we are also passing configuration objects like theming and configs. currently we are using these to change color and text of button inside iframe.

=> We have input field to change iframe on init button click.