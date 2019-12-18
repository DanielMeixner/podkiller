# Podkiller
A simple pod which kills all pods in a namespace (except itself).
Use like this:

```
kubectl run podkiller --image danielmeixner/podkiller --env=PODKILLER_NAMESPACES=default,kube-system --env=PODKILLER_DEBUG=true --env=PODKILLER_QUOTES=true
```

# Options
- PODKILLER_NAMESPACES

    A string of comma separated namespaces. Defaults to "default" if not provided.

- PODKILLER_DEBUG

    A debug flag. Defaults to false.

- PODKILLER_QUOTES

    Just a little fun in the output. Defaults to true. Life is hard enough.
