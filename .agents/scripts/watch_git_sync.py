#!/usr/bin/env python3
"""Kernel inotify watcher with auto-timeout: zero CPU, never stays running indefinitely."""
import ctypes
import os
import select
import subprocess
import sys
import time

IN_CLOSE_WRITE = 0x00000008
IN_MOVED_TO = 0x00000080
IN_CREATE = 0x00000100
WATCH_MASK = IN_CLOSE_WRITE | IN_MOVED_TO | IN_CREATE


def get_origin_main_sha(repo_dir):
    res = subprocess.run(
        ["git", "-C", repo_dir, "rev-parse", "origin/main"],
        capture_output=True,
        text=True,
        check=False,
    )
    return res.stdout.strip()


def get_commit_summary(repo_dir, sha):
    res = subprocess.run(
        ["git", "-C", repo_dir, "log", "-n", "1", "--oneline", sha],
        capture_output=True,
        text=True,
        check=False,
    )
    return res.stdout.strip()


def main():
    repo_dir = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
    baseline = sys.argv[2] if len(sys.argv) > 2 else get_origin_main_sha(repo_dir)
    timeout_sec = int(sys.argv[3]) if len(sys.argv) > 3 else 600  # auto-exit after 10 min

    libc = ctypes.CDLL("libc.so.6", use_errno=True)
    fd = libc.inotify_init()
    if fd < 0:
        sys.exit(2)

    watch_dirs = [
        os.path.join(repo_dir, ".git"),
        os.path.join(repo_dir, ".git", "refs", "remotes", "origin"),
    ]
    for d in watch_dirs:
        if os.path.isdir(d):
            libc.inotify_add_watch(fd, d.encode("utf-8"), WATCH_MASK)

    cur = get_origin_main_sha(repo_dir)
    if cur and cur != baseline:
        print(f"SYNC_DETECTED {get_commit_summary(repo_dir, cur)}", flush=True)
        return

    deadline = time.monotonic() + timeout_sec
    while True:
        remaining = deadline - time.monotonic()
        if remaining <= 0:
            print("WATCH_TIMEOUT", flush=True)
            return
        ready, _, _ = select.select([fd], [], [], remaining)
        if not ready:
            print("WATCH_TIMEOUT", flush=True)
            return
        data = os.read(fd, 4096)
        if not data:
            break
        cur = get_origin_main_sha(repo_dir)
        if cur and cur != baseline:
            print(f"SYNC_DETECTED {get_commit_summary(repo_dir, cur)}", flush=True)
            return


if __name__ == "__main__":
    main()
