from openai import OpenAI

message_history = {}

base_url = "https://api.aimlapi.com/v1"
api_key = "cc0aaa8dc6cd4fac92d7fbc318c86a75"
system_prompt = "You are a travel agent. Be descriptive and helpful."
user_prompt = "Tell me about San Francisco"

api = OpenAI(api_key=api_key, base_url=base_url)

message_history.append([
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ])

def main():
    completion = api.chat.completions.create(
        model="mistralai/Mistral-7B-Instruct-v0.2",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.7,
        max_tokens=256,
    )

    response = completion.choices[0].message.content

    print("User:", user_prompt)
    print("AI:", response)


if __name__ == "__main__":
    main()