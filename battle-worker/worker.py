import redis
import psycopg2
import json
import os
import time

REDIS_URL = os.getenv('REDIS_URL', 'redis://redis:6379')
DB_URL = os.getenv('DATABASE_URL', 'postgres://admin:password@db:5432/game')


def process():
    r = redis.from_url(REDIS_URL)
    print("Worker is listening to queue....")

    while True:
        try:
            task = r.brpop('battle_queue', timeout=2)
            if task:
                data = json.loads(task[1])
                player = data['player']
                print(f"Updating score for {player}")

                conn = psycopg2.connect(DB_URL)
                cur = conn.cursor()
                cur.execute(
                    "INSERT INTO leaderboard (player, score) VALUES (%s, 1) "
                    "ON CONFLICT (player) DO UPDATE SET score = leaderboard.score + 1",
                    (player,)
                )
                conn.commit()
                cur.close()
                conn.close()
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(2)


if __name__ == "__main__":
    process()