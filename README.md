# Flynn Health Check

This is a Docker image that monitors one or more Flynn clusters' health status through its `status` endpoint. The script inside the image is JavaScript and runs with Node.js.

For the script to work, you need to give it a configuration file with information about the clusters it should be watching as well as your Slack notification url.

## Configuration file

```
{
    "clusters": [
        {
            "name": "Production",
            "url": "https://status.DOMAIN_URL/?key=KEY"
        }
    ],
    "slack_url": "https://hooks.slack.com/services/...",
    "interval": 1800,
    "okay_interval": 6
}
```

- Clusters have a name (to be displayed in the Slack notification) and url (to poll the status from).
- `slack_url` is the url of the incoming hook of your desired Slack channel.
- `interval` is the polling interval in seconds
- `okay_interval` tells the script how often it notifies to Slack that everything is running smoothly.

## Usage

The configuration file should be in a directory of its own, that will be mounted inside the Docker container. With the configuration file in place, all you need to do to get the script up and running is to run following command:

```
docker run -v ${PWD}/config:/usr/src/app/config -t devgeniem/healthcheck
```

Note that you need to have an absolute path to your config directory to do this.