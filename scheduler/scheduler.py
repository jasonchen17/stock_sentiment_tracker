from requests import post

if __name__ == '__main__':
    print("Sending request to start top 5 scraper...")
    response = post('http://localhost:5000/start-top-5-scraper')
    print(response.json())