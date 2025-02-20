class NodeCanvas {
    constructor() {
        this.canvas = document.getElementById('nodeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.edges = [];
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
        this.offset = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.scale = 1;
        this.zoomSpeed = 0.1;
        this.nodeRadius = 20;
        this.gridSize = 50;
        this.searchQuery = '';
        this.filterType = 'all';
        this.filteredNodes = [];

        this.initCanvas();
        this.loadNodes();
        this.setupEventListeners();
    }

    initCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.draw();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));

        const searchInput = document.getElementById('searchInput');
        const filterType = document.getElementById('filterType');

        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.filterNodes();
        });

        filterType.addEventListener('change', (e) => {
            this.filterType = e.target.value;
            this.filterNodes();
        });
    }

    filterNodes() {
        if (!this.searchQuery) {
            this.filteredNodes = this.nodes;
        } else {
            this.filteredNodes = this.nodes.filter(node => {
                if (this.filterType === 'all') {
                    return (
                        (node.title && node.title.toLowerCase().includes(this.searchQuery)) ||
                        (node.label && node.label.toLowerCase().includes(this.searchQuery)) ||
                        (node.content && node.content.toLowerCase().includes(this.searchQuery)) ||
                        (node.nid && node.nid.toLowerCase().includes(this.searchQuery))
                    );
                }

                const field = this.filterType;
                return node[field] && node[field].toLowerCase().includes(this.searchQuery);
            });
        }
        this.draw();
    }

    async loadNodes() {
        const response = await fetch('/api/nodes');
        const data = await response.json();
        this.nodes = data.nodes;
        this.edges = data.edges;
        this.filteredNodes = this.nodes;
        this.draw();
    }

    handleMouseDown(e) {
        this.isDragging = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
    }

    handleMouseMove(e) {
        if (this.isDragging) {
            const dx = e.clientX - this.lastX;
            const dy = e.clientY - this.lastY;
            this.offset.x += dx;
            this.offset.y += dy;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
            this.draw();
        }
    }

    handleMouseUp() {
        this.isDragging = false;
    }

    handleWheel(e) {
        e.preventDefault();
        const mousePos = this.getMousePos(e);
        const zoom = e.deltaY < 0 ? (1 + this.zoomSpeed) : (1 - this.zoomSpeed);

        this.scale *= zoom;
        this.scale = Math.max(0.1, Math.min(5, this.scale));

        this.offset.x = mousePos.x - (mousePos.x - this.offset.x) * zoom;
        this.offset.y = mousePos.y - (mousePos.y - this.offset.y) * zoom;

        this.draw();
    }

    handleClick(e) {
        const pos = this.getMousePos(e);
        const node = this.findNodeAtPosition(pos.x, pos.y);
        if (node) {
            this.showNodeDetails(node);
        }
    }

    findNodeAtPosition(x, y) {
        const radius = this.nodeRadius;
        return this.filteredNodes.find(node => {
            const dx = node.x - x;
            const dy = node.y - y;
            return (dx * dx + dy * dy) < radius * radius;
        });
    }

    showNodeDetails(node) {
        const modal = new bootstrap.Modal(document.getElementById('nodeDetailsModal'));
        document.getElementById('nodeTitle').textContent = node.title;
        document.getElementById('nodeContent').textContent = node.content;
        document.getElementById('nodeNID').textContent = node.nid;

        const linkButton = document.getElementById('nodeLinkButton');
        if (node.link) {
            linkButton.href = node.link;
            linkButton.style.display = 'inline-block';
        } else {
            linkButton.style.display = 'none';
        }

        modal.show();
    }

    getMousePos(e) {
        return {
            x: (e.clientX - this.offset.x) / this.scale,
            y: (e.clientY - this.offset.y) / this.scale
        };
    }

    drawNode(node) {
        const gradient = this.ctx.createRadialGradient(
            node.x, node.y, this.nodeRadius * 0.5,
            node.x, node.y, this.nodeRadius * 1.5
        );
        gradient.addColorStop(0, '#00ff9d');
        gradient.addColorStop(1, 'rgba(0, 255, 157, 0)');

        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, this.nodeRadius * 1.5, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, this.nodeRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#0a1a1f';
        this.ctx.fill();
        this.ctx.strokeStyle = '#00ff9d';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        if (node.label) {
            this.ctx.font = '14px "Courier New", monospace';

            const labelY = node.y - this.nodeRadius - 15;
            const labelWidth = this.ctx.measureText(node.label).width;
            this.ctx.fillStyle = 'rgba(10, 26, 31, 0.9)';
            this.ctx.fillRect(node.x - labelWidth/2 - 5, labelY - 10, labelWidth + 10, 20);

            this.ctx.strokeStyle = '#00ff9d';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(node.x - labelWidth/2 - 5, labelY - 10, labelWidth + 10, 20);

            this.ctx.shadowColor = '#00ff9d';
            this.ctx.shadowBlur = 5;
            this.ctx.fillStyle = '#00ff9d';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(node.label, node.x, labelY);
            this.ctx.shadowBlur = 0;
        }
    }

    drawEdge(source, target) {

        this.ctx.beginPath();
        this.ctx.moveTo(source.x, source.y);
        this.ctx.lineTo(target.x, target.y);

        this.ctx.shadowColor = '#00ff9d';
        this.ctx.shadowBlur = 10;
        this.ctx.strokeStyle = '#00ff9d';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
    }

    drawGrid() {
        const gridSize = this.gridSize * this.scale;
        const offsetX = this.offset.x % gridSize;
        const offsetY = this.offset.y % gridSize;

        this.ctx.strokeStyle = 'rgba(0, 255, 157, 0.1)';
        this.ctx.lineWidth = 1;

        for (let x = offsetX; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = offsetY; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }

        this.ctx.strokeStyle = 'rgba(0, 255, 157, 0.05)';
        for (let i = 0; i < this.canvas.width + this.canvas.height; i += gridSize * 2) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(0, i);
            this.ctx.stroke();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawGrid();

        this.ctx.save();
        this.ctx.translate(this.offset.x, this.offset.y);
        this.ctx.scale(this.scale, this.scale);

        this.edges.forEach(edge => {
            const source = this.filteredNodes.find(n => n.id === edge.source);
            const target = this.filteredNodes.find(n => n.id === edge.target);
            if (source && target) {
                this.drawEdge(source, target);
            }
        });


        this.filteredNodes.forEach(node => this.drawNode(node));

        this.ctx.restore();
    }
}

window.addEventListener('load', () => {
    new NodeCanvas();
});