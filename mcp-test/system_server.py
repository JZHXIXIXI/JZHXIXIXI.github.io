import psutil
# 核心修改：改用新版 SDK 标准的全局导入方式
import mcp.server.fastmcp as fastmcp

# 1. 初始化 FastMCP 服务
mcp = fastmcp.FastMCP("SystemMonitor")

# 2. 注册 Tool 工具
@mcp.tool()
def get_system_stats() -> str:
    """
    获取当前电脑的系统状态，包括 CPU 使用率和内存使用率。
    """
    cpu_percent = psutil.cpu_percent(interval=1)
    memory_info = psutil.virtual_memory()
    
    return f"当前系统状态：CPU 使用率: {cpu_percent}%, 内存使用率: {memory_info.percent}%"

if __name__ == "__main__":
    # 3. 启动服务
    mcp.run()