import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
import time
import os
from colorama import init, Fore, Style

init()

def scrape_page(url, driver):
    driver.get(url)

    try:
        name = WebDriverWait(driver, 3).until(EC.presence_of_element_located((By.XPATH, '//*[@id="firstHeading"]/span'))).text
        picture = driver.find_element(By.XPATH, '//*[@id="mw-content-text"]/div[1]/div[1]/div[2]/div/div/a/img').get_attribute('src')
        level = driver.find_element(By.XPATH, '//*[@id="mw-content-text"]/div[1]/div[1]/div[4]/div[2]').text
        cost = driver.find_element(By.XPATH, '//*[@id="mw-content-text"]/div[1]/div[1]/div[4]/div[4]').text
        limit = driver.find_element(By.XPATH, '//*[@id="mw-content-text"]/div[1]/div[1]/div[4]/div[6]').text
        rarity = driver.find_element(By.XPATH, '//*[@id="mw-content-text"]/div[1]/div[1]/div[5]').text
        pack = driver.find_element(By.XPATH, '//*[@id="mw-content-text"]/div[1]/div[1]/div[6]/a/span').text
        type_ = driver.find_element(By.XPATH, '//*[@id="mw-content-text"]/div[1]/div[1]/div[1]').text

        print(f"{Fore.GREEN}[✔] FOUND! Card: {name}{Style.RESET_ALL}")

        return {
            "name": name,
            "picture": picture,
            "level": level,
            "cost": cost,
            "limit": limit,
            "rarity": rarity,
            "pack": pack,
            "type": type_
        }
    except NoSuchElementException:
        try:
            picture = driver.find_element(By.XPATH, '//*[@id="mw-content-text"]/div[1]/div[3]/div/div[2]/div[1]/div/div[2]/div/div/a/img').get_attribute('src')
            level = driver.find_element(By.XPATH, '//*[@id="mw-content-text"]/div[1]/div[3]/div/div[2]/div[1]/div/div[4]/div[2]').text
            cost = driver.find_element(By.XPATH, '//*[@id="mw-content-text"]/div[1]/div[3]/div/div[2]/div[1]/div/div[4]/div[4]').text
            limit = driver.find_element(By.XPATH, '//*[@id="mw-content-text"]/div[1]/div[3]/div/div[2]/div[1]/div/div[4]/div[6]').text
            rarity = driver.find_element(By.XPATH, '//*[@id="mw-content-text"]/div[1]/div[3]/div/div[2]/div[1]/div/div[5]').text
            pack = driver.find_element(By.XPATH, '//*[@id="mw-content-text"]/div[1]/div[3]/div/div[2]/div[1]/div/div[6]/a/span').text
            type_ = driver.find_element(By.XPATH, '//*[@id="mw-content-text"]/div[1]/div[3]/div/div[2]/div[1]/div/div[1]').text

            print(f"{Fore.GREEN}[✔] FOUND! Card: {name}{Style.RESET_ALL}")

            return {
                "name": name,
                "picture": picture,
                "level": level,
                "cost": cost,
                "limit": limit,
                "rarity": rarity,
                "pack": pack,
                "type": type_
            }
        except Exception as e:
            print(f"{Fore.RED}[✖] Nothing found in page ({driver.current_url}), likely a script problem {Style.RESET_ALL}")
            return None


def main():
    start_url = 'https://orangejuice.wiki/wiki/Cards/Cards_List'
    link_selector = '.tablecolor:first-of-type td:nth-of-type(2) a[href]'

    chrome_options = Options()
    chrome_options.add_argument('--headless=new')
    chrome_options.add_argument("--log-level=3")
    driver = webdriver.Chrome(options=chrome_options)
    driver.get(start_url)

    links = driver.find_elements(By.CSS_SELECTOR, link_selector)
    urls = [link.get_attribute('href') for link in links]

    data = []
    for url in urls:
        page_data = scrape_page(url, driver)
        if page_data:
            data.append(page_data)
        time.sleep(1)

    driver.quit()

    output_file = 'scraped_data.json'
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=4)
        os.system('cls');
    print(r"""-=**#*=:.:=**+:..---.     ......    .:::::::::::::::::::::..:=**=:              
*+-:        =**=:.   ..:::::::::::.. ..:::::::::::::::::::::.. :+**-            
          :+*+:   ..:-=--::::::::::::...::::::::::::::..     ..  .=*#=.         
        -**=.  ..::=+-..:::.. ...:::::::::. .::::::::.    .        .-*#=.       
      :+#=.  .:::=+- .:..    .:. ..::::::::.  ..::::::.    ...       .-**=      
    :+#+:  ..::-+=  ..    .. .::.  .::::::::.   .::::::.    .::..      .+#*:    
   =#*:  ..:::=+.        .:  .::.    .::::::-.    .::::.     .::::..     -*#=   
 -**:   .::.:+-         .:.  .:::.    .:::::==.    .::::.     .:::::..    .*#+  
+#=.  .:...=+:        .:::.  .:::-:     .::::+-..    .::.      .:::::::.   .+#+ 
*:  .::. .++. .:     .:::-=  .::-=:-.    .::.-+..-    .:.       .::::::::.  .+#=
  ..-=: :+=  -=.    .::.:++  .::-= .=: .:-====*=:-+:   .:.      .::::::::::. .**
 .-+=  :+- :+=     .-===*-+.  .::+:  ++-.. .:.==  .+-.. ..       :::::--::::. -#
=**-. :+:.===:    .::::=-:+-  .::=- ...-:   .::+.  .+:  ..       .:::::==-:::.:*
**+- .=-=+::=.   .:::.=-  :+  .::==     :-   .:+.   :+.          .:::::-==+::::+
+*= .-==-:.=-   .::::-=    =- .:.-+.     .-.  .+.    ==           ::::::=--+:::+
*+..-+-::.:=:   :::::-.    .+: :::+:.:     .:. =.     +-    .     ::::::=+.=+:.+
*..=-.:...-=.  .::::-=::. :::+..:.==-  :-=+++*++:.    :+.   . ..  ::::::-+:===:+
=.-:::.  .-=  .-::=*******=. -=..::+:-*************+-  +=   . .-. ::::::-*:=-=-+
..:-=.  .:==  :=:+*++++++*#+. -=.:.=*+++++++++++++::+*-:+. .:  =: ::::::=+:=:-=+
.-*+:  .::==  =-+*-+*+++++*=.  -=.:-**+++++++++++*+  :*==- .: .=..::::::+===::=+
-**=. .:::== :+-*=-**++++**-    :=:.=*+++++++++++**:  .=+= .:.-= .::::::*-=-.:=*
***: .::::=+ +*:*=-**+++++*=     .=::*+++++++++++*#-   .==...:+:.::::::=+-=:::+#
**+   ..:.-+-+*---:**+++++*=       --**++++++++++=*-    .=:.:=- .:::::-*:==.:-#*
***+-   .::=*--*:.:**++*:           :*++++++++*=        .-::+= .::::::*=:+-.:=#=
*.:+#*-  ..-*-.-*=:+*=++=-==         +==+++++++==*+     .-:+= .::::::+=:-+:::** 
+:  .*#= .:-=.:=:=++*=====+=         =+==========+.     :===:.::::::+=::==.:-#* 
     .*#-.::-=+.:::-=++++=-.          :-=====-:::.      ==..+.::::-+-:::+-.:=*+.
      *#=::.++..:::          .......::.                :+: .+:::-==::::-+:::++*#
     :*#-.:+#: .::=.         :=-::::::==.              -=  .+::=+: .:::-+.:::. =
    .*#=:-*#*.  .:+:         :+:.......==             :+   .=:=+:.  .::==.:::. =
   .*#=:=***+.  .:+-          ==.......-=            :+.   -:-+-.:   .:+-::::.:*
  .**-:*#=-*+.  .::=*=-.       :==----==.         .:-*:   .-=+:::-=  .:+::::::=#
  .*+-*+. :**.  .::=*+*#*++=-::...:::.         :-+..+:   .:++:::::==  .+::::::=-
    --.   .*#:   .:+*   :--=+****#*:::-==...    ...+:   .-+-:::::::=+. =::::::::
           *#=   .=**         :**-   :-.:----::. .+:   .+*-::::::::.-=--:.::::::
           :*#.  .+#=   -+***#*+:.   +:         .+:  .=+-=+======----:-==::-::::
            =#*   +*- .*#=:..:---==.======     :+.  -+=---+:             . .=-::
             =**. =*= +#-.........+=+---=+.:::--  :==-----==                 -+-
              .+*+=***#*--:.......=+--==:   .----=--------+-                   :
                .-*##-::::-=+-...-+--+:    :====----------+.       """)
    print(f"{Fore.GREEN}Found {len(data)} results and saved in '{output_file}', thank you for using 100% Orange Juice - Data Scrapper!")

if __name__ == '__main__':
    main()
