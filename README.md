# Sample rollup indices

This repo contains instructions on how to load sample data for downsampled indices.





### Assumptions

The code assumes that:

- Elasticsearch server runs at `http://localhost:9200`
- Elasticsearch server is built from 8.2.x with TSDB support
- Elasticsearch server requires no authentication
- `curl` command must be installed


### Create indices and load data

```shell
# Define variables. `dataset` variable can be either `sample-01` or `sample-02`
dataset="sample-01"
raw_index="$dataset"
rollup_index="$raw_index-rollup"

# delete source index
curl -s -XDELETE  "http://localhost:9200/$raw_index"

# create source index with its settings/mapping
curl -s -H 'Content-Type: application/json' -XPUT "http://localhost:9200/$raw_index" -d @raw-index-mapping.json

# load data to the source index
curl -s -H "Content-Type: application/json" -XPOST http://localhost:9200/$raw_index/_bulk?pretty --data-binary @$dataset-raw.json

# delete rollup index
curl -s -XDELETE  "http://localhost:9200/$rollup_index"

# create the rollup index with its settings/mapping
curl -s -H 'Content-Type: application/json' -XPUT "http://localhost:9200/$rollup_index" -d @rollup-index-mapping.json

# load data to the rollup index
curl -s -H "Content-Type: application/json" -XPOST http://localhost:9200/$rollup_index/_bulk?pretty --data-binary @$dataset-rollup.json
```
