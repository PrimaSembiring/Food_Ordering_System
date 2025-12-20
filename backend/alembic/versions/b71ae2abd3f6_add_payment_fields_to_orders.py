"""add payment fields to orders

Revision ID: b71ae2abd3f6
Revises: 5dce65c1eb74
Create Date: 2025-12-20 00:22:36.896355

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b71ae2abd3f6'
down_revision: Union[str, Sequence[str], None] = '5dce65c1eb74'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        "orders",
        sa.Column("payment_status", sa.String(length=20), server_default="unpaid")
    )
    op.add_column(
        "orders",
        sa.Column("payment_method", sa.String(length=50), nullable=True)
    )
    op.add_column(
        "orders",
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now())
    )

def downgrade():
    op.drop_column("orders", "created_at")
    op.drop_column("orders", "payment_method")
    op.drop_column("orders", "payment_status")

