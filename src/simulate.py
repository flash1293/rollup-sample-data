from copy import deepcopy
from datetime import datetime, timedelta
import json
from random import randrange

json_template = '''
    {"@timestamp":"2021-04-28T19:45:28.138Z",
    "kubernetes":{
        "host":{"name":"gke-apps-host-name-28"},
        "node":{"name":"gke-apps-node-name-48"},
        "pod":{"name":"pod-name-pod-name-264"},
        "container":{
            "cpu":{"usage":{"nanocores":111162,"core":{"ns":12828317850},"node":{"pct":0.0000277905},"limit":{"pct":0.0000277905}}},
            "memory":{"available":{"bytes":798818304},"usage":{"bytes":279097344,"node":{"pct":0.01770037710617187},"limit":{"pct":0.00009923134671484496}},"workingset":{"bytes":1540096},"rss":{"bytes":270336},"pagefaults":287859,"majorpagefaults":0},
            "start_time":"2021-03-30T07:59:06Z","name":"container-name-44"},
        "namespace":"namespace26"}
    }
'''


ts_start = datetime.fromisoformat('2021-04-04')
ts_end  = datetime.fromisoformat('2021-04-07')
interval_sec = 10
event_num = 20000
hosts_num = 2
nodes_num = 2
pods_num = 1


def random_metric_double(val: float):
    f = randrange(20, 150)
    return val * f/100

def random_metric_int(val: int):
    return round(random_metric_double(val))

def random_ts(ts_start: datetime, ts_end: datetime, interval_sec: int):
    delta = ts_end - ts_start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = randrange(int_delta)
    random_second = random_second - (random_second % interval_sec)

    return ts_start + timedelta(seconds=random_second)


def main():
    template_event = json.loads(json_template)

    for c in range(event_num):
        event = deepcopy(template_event)
        ts = random_ts(ts_start, ts_end, interval_sec)
        kub_host = 'gke-apps-' + str(randrange(hosts_num))
        kub_node = kub_host + "-" + str(randrange(nodes_num))
        kub_pod = kub_node + "-" + str(randrange(pods_num))

        event['@timestamp'] = ts.strftime("%Y-%m-%dT%H:%M:%SZ")
        event['kubernetes']['host'] = kub_host
        event['kubernetes']['node'] = kub_node
        event['kubernetes']['pod'] = kub_pod

        cpu = event['kubernetes']['container']['cpu']
        cpu['usage']['nanocores'] = random_metric_int(cpu['usage']['nanocores'])
        
        mem = event['kubernetes']['container']['memory']
        mem['available']['bytes'] = random_metric_int(mem['available']['bytes'])
        mem['usage']['bytes'] = random_metric_int(mem['usage']['bytes'])
        mem['workingset']['bytes'] = random_metric_int(mem['workingset']['bytes'])
        mem['rss']['bytes'] = random_metric_int(mem['rss']['bytes'])
        mem['pagefaults'] = random_metric_int(mem['pagefaults'])

        print('{"index": {}}')
        print(json.dumps(event))


if __name__ == '__main__':
    main()

