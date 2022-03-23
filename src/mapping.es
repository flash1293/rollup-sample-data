
GET sample-02

POST sample-02-rollup/_search

DELETE sample-02



PUT sample-01
{
    "settings": {
        "index": {
            "mode": "time_series",
            "time_series": {
                "start_time": "2021-04-01T00:00:00Z",
                "end_time": "2021-04-30T23:59:59Z"
            },
            "routing_path": [
                "kubernetes.namespace", "kubernetes.host", "kubernetes.node","kubernetes.pod"
            ],
            "number_of_replicas": 0,
            "number_of_shards": 1
        }
    },

    "mappings": {
        "properties": {
            "@timestamp": {
                "type": "date"
            },
            "kubernetes": {
                "properties": {
                    "container": {
                        "properties": {
                            "cpu": {
                                "properties": {
                                    "usage": {
                                        "properties": {
                                            "core": {
                                                "properties": {
                                                    "ns": {
                                                        "type": "long"
                                                    }
                                                }
                                            },
                                            "limit": {
                                                "properties": {
                                                    "pct": {
                                                        "type": "float"
                                                    }
                                                }
                                            },
                                            "nanocores": {
                                                "type": "long",
                                                "time_series_metric": "gauge"
                                            },
                                            "node": {
                                                "properties": {
                                                    "pct": {
                                                        "type": "float"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "memory": {
                                "properties": {
                                    "available": {
                                        "properties": {
                                            "bytes": {
                                                "type": "long",
                                                "time_series_metric": "gauge"
                                            }
                                        }
                                    },
                                    "majorpagefaults": {
                                        "type": "long"
                                    },
                                    "pagefaults": {
                                        "type": "long",
                                        "time_series_metric": "gauge"
                                    },
                                    "rss": {
                                        "properties": {
                                            "bytes": {
                                                "type": "long",
                                                "time_series_metric": "gauge"
                                            }
                                        }
                                    },
                                    "usage": {
                                        "properties": {
                                            "bytes": {
                                                "type": "long",
                                                "time_series_metric": "gauge"
                                            },
                                            "limit": {
                                                "properties": {
                                                    "pct": {
                                                        "type": "float"
                                                    }
                                                }
                                            },
                                            "node": {
                                                "properties": {
                                                    "pct": {
                                                        "type": "float"
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    "workingset": {
                                        "properties": {
                                            "bytes": {
                                                "type": "long",
                                                "time_series_metric": "gauge"
                                            }
                                        }
                                    }
                                }
                            },
                            "name": {
                                "type": "keyword"
                            },
                            "start_time": {
                                "type": "date"
                            }
                        }
                    },
                    "host": {
                        "type": "keyword",
                        "time_series_dimension": true
                    },
                    "namespace": {
                        "type": "keyword",
                        "time_series_dimension": true
                    },
                    "node": {
                        "type": "keyword",
                        "time_series_dimension": true
                    },
                    "pod": {
                        "type": "keyword",
                        "time_series_dimension": true
                    }
                }
            }
        }
    }

}


DELETE rollup-test-index-01


POST /sample-02-dd/_rollup/sample-02-rollup-dd
{
    "groups": {
        "date_histogram": {
            "field": "@timestamp",
            "fixed_interval": "1h"
        },
        "terms": {
            "fields": [
                "kubernetes.namespace", "kubernetes.host", "kubernetes.node","kubernetes.pod"
            ]
        }
    },
    "metrics": [
        {
            "field": "kubernetes.container.cpu.usage.nanocores",
            "metrics": [
                "min", "max", "sum", "value_count"
            ]
        },
        {
            "field": "kubernetes.container.memory.available.bytes",
            "metrics": [
                "min", "max", "sum", "value_count"
            ]
        },
        {
            "field": "kubernetes.container.memory.usage.bytes",
            "metrics": [
                "min", "max", "sum", "value_count"
            ]
        },
        {
            "field": "kubernetes.container.memory.workingset.bytes",
            "metrics": [
                "min", "max", "sum", "value_count"
            ]
        },
        {
            "field": "kubernetes.container.memory.rss.bytes",
            "metrics": [
                "min", "max", "sum", "value_count"
            ]
        },
        {
            "field": "kubernetes.container.memory.pagefaults",
            "metrics": [
                "min", "max", "sum", "value_count"
            ]
        }
    ]
}




DELETE sample-02-rollup-dd

GET sample-01-rollup


PUT sample-02-rollup
{
    "settings": {
        "index": {
            "mode": "time_series",
            "time_series": {
                "start_time": "2021-04-01T00:00:00Z",
                "end_time": "2021-04-30T23:59:59Z"
            },
            "routing_path": [
               "kubernetes.namespace", "kubernetes.host", "kubernetes.node","kubernetes.pod"
            ],
            "number_of_replicas": 0,
            "number_of_shards": 1
        }
    },

    "mappings": {
        "dynamic_templates": [
            {
                "strings": {
                    "match_mapping_type": "string",
                    "mapping": {
                        "type": "keyword"
                    }
                }
            }
        ],
        "properties": {
            "@timestamp": {
                "type": "date",
                "meta": {
                    "fixed_interval": "1h",
                    "time_zone": "UTC"
                }
            },
            "kubernetes": {
                "properties": {
                    "container": {
                        "properties": {
                            "cpu": {
                                "properties": {
                                    "usage": {
                                        "properties": {
                                            "nanocores": {
                                                "type": "aggregate_metric_double",
                                                "metrics": [
                                                    "min",
                                                    "max",
                                                    "sum",
                                                    "value_count"
                                                ],
                                                "default_metric": "value_count",
                                                "time_series_metric": "gauge"
                                            }
                                        }
                                    }
                                }
                            },
                            "memory": {
                                "properties": {
                                    "available": {
                                        "properties": {
                                            "bytes": {
                                                "type": "aggregate_metric_double",
                                                "metrics": [
                                                    "min",
                                                    "max",
                                                    "sum",
                                                    "value_count"
                                                ],
                                                "default_metric": "value_count",
                                                "time_series_metric": "gauge"
                                            }
                                        }
                                    },
                                    "pagefaults": {
                                        "type": "aggregate_metric_double",
                                        "metrics": [
                                            "min",
                                            "max",
                                            "sum",
                                            "value_count"
                                        ],
                                        "default_metric": "value_count",
                                        "time_series_metric": "gauge"
                                    },
                                    "rss": {
                                        "properties": {
                                            "bytes": {
                                                "type": "aggregate_metric_double",
                                                "metrics": [
                                                    "min",
                                                    "max",
                                                    "sum",
                                                    "value_count"
                                                ],
                                                "default_metric": "value_count",
                                                "time_series_metric": "gauge"
                                            }
                                        }
                                    },
                                    "usage": {
                                        "properties": {
                                            "bytes": {
                                                "type": "aggregate_metric_double",
                                                "metrics": [
                                                    "min",
                                                    "max",
                                                    "sum",
                                                    "value_count"
                                                ],
                                                "default_metric": "value_count",
                                                "time_series_metric": "gauge"
                                            }
                                        }
                                    },
                                    "workingset": {
                                        "properties": {
                                            "bytes": {
                                                "type": "aggregate_metric_double",
                                                "metrics": [
                                                    "min",
                                                    "max",
                                                    "sum",
                                                    "value_count"
                                                ],
                                                "default_metric": "value_count",
                                                "time_series_metric": "gauge"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "host": {
                        "type": "keyword",
                        "time_series_dimension": true
                    },
                    "namespace": {
                        "type": "keyword",
                        "time_series_dimension": true
                    },
                    "node": {
                        "type": "keyword",
                        "time_series_dimension": true
                    },
                    "pod": {
                        "type": "keyword",
                        "time_series_dimension": true
                    }
                }
            }
        }
    }
}

GET /sample-01-rollup/_mapping



// curl -s -H "Content-Type: application/json" -XPOST localhost:9200/sample-01/_bulk?pretty --data-binary @sample-01-raw.json
// curl -s -H "Content-Type: application/json" -XPOST localhost:9200/sample-02/_bulk?pretty --data-binary @sample-02-raw.json



// elasticdump   --input=http://localhost:9200/rollup-test-index-01 --output=rollup-mapping.json --type=mapping

// elasticdump   --input=http://localhost:9200/sample-01-rollup-orig --output=sample-01-rollup-orig.json --type=data
// cat rollup-test-index.json  | jq -c "._source" | tee rr.json
// ./parse_docs.sh rr.json > rollup-test-index2.json

// curl -s -H "Content-Type: application/json" -XPOST localhost:9200/sample-01-rollup/_bulk?pretty --data-binary @sample-01-rollup.json
// curl -s -H "Content-Type: application/json" -XPOST localhost:9200/sample-02-rollup/_bulk?pretty --data-binary @sample-02-rollup.json
