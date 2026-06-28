import os
import io
import tempfile

def parse_multipart(environ, content_length, body_bytes):
    """Simple multipart form parser for WSGI."""
    content_type = environ.get("CONTENT_TYPE", "")
    boundary = None
    for part in content_type.split(";"):
        part = part.strip()
        if part.startswith("boundary="):
            boundary = part[9:].strip()
            if boundary.startswith('"') and boundary.endswith('"'):
                boundary = boundary[1:-1]
            break

    if not boundary:
        return {}

    boundary_bytes = boundary.encode()
    parts = body_bytes.split(b"--" + boundary_bytes)
    result = {}

    for part_data in parts:
        if not part_data or part_data.strip() == b"--" or part_data.strip() == b"":
            continue

        header_end = part_data.find(b"\r\n\r\n")
        if header_end == -1:
            continue

        headers_raw = part_data[:header_end].decode("utf-8", errors="replace")
        body = part_data[header_end + 4:]

        if body.endswith(b"\r\n"):
            body = body[:-2]

        name = None
        filename = None
        for line in headers_raw.split("\r\n"):
            if line.lower().startswith("content-disposition:"):
                for part_attr in line.split(";"):
                    part_attr = part_attr.strip()
                    if part_attr.startswith("name="):
                        name = part_attr[5:].strip().strip('"')
                    elif part_attr.startswith("filename="):
                        filename = part_attr[9:].strip().strip('"')

        if name:
            if filename:
                result[name] = type("FileObj", (), {
                    "file": io.BytesIO(body),
                    "filename": filename,
                    "read": lambda self=io.BytesIO(body): self.read()
                })()
            else:
                result[name] = body.decode("utf-8", errors="replace")

    return result
