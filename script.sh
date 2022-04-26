# Define variables. `dataset` variable can be either `sample-01` or `sample-02`
dataset="sample-01"
# the name of the source index
raw_index="$dataset"
# the name of the rollup index
rollup_index="$raw_index-rollup"

# delete source index - this may fail if the index does not exist
curl -s -XDELETE  "http://elastic:changeme@localhost:9200/$raw_index"

# create source index with its settings/mapping
curl -s -H 'Content-Type: application/json' -XPUT "http://elastic:changeme@localhost:9200/$raw_index" -d @raw-index-mapping.json

# load data to the source index
curl -s -H "Content-Type: application/json" -XPOST http://elastic:changeme@localhost:9200/$raw_index/_bulk?pretty --data-binary @$dataset-raw.json

# delete rollup index - this may fail if the index does not exist
curl -s -XDELETE  "http://elastic:changeme@localhost:9200/$rollup_index"

# create the rollup index with its settings/mapping
curl -s -H 'Content-Type: application/json' -XPUT "http://elastic:changeme@localhost:9200/$rollup_index" -d @rollup-index-mapping.json

# load data to the rollup index
curl -s -H "Content-Type: application/json" -XPOST http://elastic:changeme@localhost:9200/$rollup_index/_bulk?pretty --data-binary @$dataset-rollup.json

