import subprocess, sys, asyncio, requests, json

if 'win32' in sys.platform:
    # Windows specific event-loop policy & cmd
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

async def command():
  '''
  '''
  command = ['jtf', 'get', 'cdli', '-p', 'import.txt']
  #command = ['jtf', 'get', 'cdli', '-a', '-p', 'import.txt']
  proc = await asyncio.create_subprocess_shell(
      ' '.join(command),
      stdout=asyncio.subprocess.PIPE,
      stderr=asyncio.subprocess.PIPE)
  while True:
    data = await proc.stdout.readline()
    line = data.decode('utf-8').rstrip()
    if 'Endpoint set' in line:
      return await fetch_data()

async def fetch_data():
  '''
  '''
  while True:
    try:
      return json.loads(requests.get("http://localhost:9000/").text)
    except:
      print("Unexpected error:", sys.exc_info()[0])
      raise

result = asyncio.run(command())
print(result)

