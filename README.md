# Sample rollup indices

This repo contains instructions on how to load sample data for downsampled indices.

The data it loads resemble metrics from a kubernetes host for two different periods:

- Dataset **sample-01**: `2021-04-01T00:00:00Z` to `2021-04-03T23:59:59Z`.
- Dataset **sample-02**: `2021-04-04T00:00:00Z` to `2021-04-06T23:59:59Z`.

A raw index has been created with the [raw index mapping](raw-index-mapping.json).
A sample raw document looks like this:

```json
{
    "@timestamp" : "2021-04-01T20:23:30Z",
    "kubernetes" : {
    "host" : "gke-apps-0",
    "node" : "gke-apps-0-0",
    "pod" : "gke-apps-0-0-0",
    "container" : {
        "cpu" : {
        "usage" : {
            "nanocores" : 60027,
            "core" : {
            "ns" : 12828317850
            },
            "node" : {
            "pct" : 2.77905E-5
            },
            "limit" : {
            "pct" : 2.77905E-5
            }
        }
        },
        "memory" : {
        "available" : {
            "bytes" : 942605599
        },
        "usage" : {
            "bytes" : 173040353,
            "node" : {
            "pct" : 0.01770037710617187
            },
            "limit" : {
            "pct" : 9.923134671484496E-5
            }
        },
        "workingset" : {
            "bytes" : 1786511
        },
        "rss" : {
            "bytes" : 313590
        },
        "pagefaults" : 428910,
        "majorpagefaults" : 0
        },
        "start_time" : "2021-03-30T07:59:06Z",
        "name" : "container-name-44"
    },
    "namespace" : "namespace26"
    }
}
```

The downsampled index has been created with a `fixed_interval: 1h` and `UTC` time zone using the [rollup index mapping](rollup-index-mapping.json). 
A sample rollup document looks like this:

```json
{
    "_doc_count" : 61,
    "kubernetes.node" : "gke-apps-0-0",
    "kubernetes.pod" : "gke-apps-0-0-0",
    "kubernetes.container.memory.available.bytes" : {
    "min" : 167751844,
    "max" : 1126333809,
    "sum" : 37680259400,
    "value_count" : 61
    },
    "kubernetes.container.memory.pagefaults" : {
    "min" : 63329,
    "max" : 428910,
    "sum" : 14197206,
    "value_count" : 61
    },
    "kubernetes.container.memory.usage.bytes" : {
    "min" : 58610442,
    "max" : 413064069,
    "sum" : 13307361363,
    "value_count" : 61
    },
    "kubernetes.container.cpu.usage.nanocores" : {
    "min" : 26679,
    "max" : 164520,
    "sum" : 5788206,
    "value_count" : 61
    },
    "@timestamp" : "2021-04-03T23:00:00.000Z",
    "kubernetes.namespace" : "namespace26",
    "kubernetes.container.memory.rss.bytes" : {
    "min" : 70287,
    "max" : 402801,
    "sum" : 13681703,
    "value_count" : 61
    },
    "kubernetes.container.memory.workingset.bytes" : {
    "min" : 431227,
    "max" : 2294743,
    "sum" : 79869381,
    "value_count" : 61
    },
    "kubernetes.host" : "gke-apps-0"
}
```

### Assumptions

The code assumes that:

- Elasticsearch server runs at `http://localhost:9200`
- Elasticsearch server is built from 8.2.x with TSDB support
- Elasticsearch server requires no authentication
- `curl` command must be installed

### Create indices and load data

Below there are instructions create indices and load data.
The user is only expected to change the `dataset` variable and set it to one of sample datasets (`sample-01` or `sample-02`).
The rest of the shell commands can be copied and pasted as they are.

```shell
# Define variables. `dataset` variable can be either `sample-01` or `sample-02`
dataset="sample-01"
# the name of the source index
raw_index="$dataset"
# the name of the rollup index
rollup_index="$raw_index-rollup"

# delete source index - this may fail if the index does not exist
curl -s -XDELETE  "http://localhost:9200/$raw_index"

# create source index with its settings/mapping
curl -s -H 'Content-Type: application/json' -XPUT "http://localhost:9200/$raw_index" -d @raw-index-mapping.json

# load data to the source index
curl -s -H "Content-Type: application/json" -XPOST http://localhost:9200/$raw_index/_bulk?pretty --data-binary @$dataset-raw.json

# delete rollup index - this may fail if the index does not exist
curl -s -XDELETE  "http://localhost:9200/$rollup_index"

# create the rollup index with its settings/mapping
curl -s -H 'Content-Type: application/json' -XPUT "http://localhost:9200/$rollup_index" -d @rollup-index-mapping.json

# load data to the rollup index
curl -s -H "Content-Type: application/json" -XPOST http://localhost:9200/$rollup_index/_bulk?pretty --data-binary @$dataset-rollup.json
```
