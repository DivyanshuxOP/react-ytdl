import os
import tempfile
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import yt_dlp
import time

app = Flask(__name__)
CORS(app)

@app.route('/api/video-info', methods=['GET'])
def video_info():
    video_url = request.args.get('url')
    if not video_url:
        return jsonify({'error': 'Missing URL parameter'}), 400

    try:
        with yt_dlp.YoutubeDL({'quiet': True}) as ydl:
            info = ydl.extract_info(video_url, download=False)
            unique_formats = {}
            for f in info['formats']:
                resolution = f"{f.get('height', 'audio only')}p"
                ext = f['ext']
                if resolution not in unique_formats:
                    unique_formats[resolution] = {
                        'itag': f['format_id'],
                        'resolution': resolution,
                        'quality': f.get('format_note', 'unknown'),
                        'filesize': f.get('filesize', 'N/A'),
                        'ext': ext,
                    }
            formats = list(unique_formats.values())
            return jsonify({
                'title': info['title'],
                'thumbnail': info['thumbnail'],
                'duration': info['duration'],
                'formats': formats,
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download', methods=['GET'])
def download():
    file_name = "output.webm"
    tmp_dir = tempfile.gettempdir()
    file_path = os.path.join(tmp_dir, file_name)
    if os.path.exists(file_path):
        os.remove(file_path)

    video_url = request.args.get('url')
    itag = request.args.get('format')
    
    if not video_url or not itag:
        return {'error': 'Missing parameters'}, 400
    
    print(f"Received itag: {itag}")  # Debugging statement

    try:
        output_video_path = os.path.join(tempfile.gettempdir(), 'output.webm')
        ydl_opts = {
            'format': f'{itag}+bestaudio/best',
            'outtmpl': output_video_path,
            'merge_output_format': 'webm',  # Ensure the output format is webm
            'postprocessors': [{
                'key': 'FFmpegVideoConvertor',
                'preferedformat': 'webm'  # Convert to webm after merging
            }]
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])

        return send_file(output_video_path, as_attachment=True)

    except Exception as e:
        print(f"Error: {e}")
        return {'error': 'Failed to process download request'}, 500

    """
    finally:
        retries = 3
        for _ in range(retries):
            try:
                if os.path.exists(output_video_path):
                    os.remove(output_video_path)
                break
            except PermissionError:
                time.sleep(1)
        else:
            print(f"Failed to delete {output_video_path} after {retries} retries.")
    """

if __name__ == '__main__':
    app.run(debug=True)